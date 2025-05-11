import { Request, Response } from "express";
import getBuffer from "../lib/datauri.js";
import cloudinary from "cloudinary"
import prisma from "../config/prisma.js";
import { redisClient } from "../lib/redis.js";


export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        role: string;
    }
}

export const addAlbum = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if(req.user?.role != "admin") {
            res.status(401).json({
                message: "You are not eligible"
            })
            return
        }
    
        const { title, description } = req.body
        const file = req.file
        if(!file) {
            res.status(400).json({
                message: "No file provided"
            })
            return
        }
    
        const fileBuffer = getBuffer(file)
    
        if(!fileBuffer || !fileBuffer.content) {
            res.status(500).json({
                message: "Failed to generate file buffer"
            })
            return
        }
    
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "albums"
        })
    
        const result = await prisma.album.create({
            data: {
                title,
                description,
                thumbnail: cloud.secure_url,
            }
        })
    
        if(redisClient.isReady) {
            await redisClient.del("albums")
            console.log("Cache invalidated for albums");
        }
        res.status(200).json({
            message: "Album created",
            album: result
        })
    } catch (error) {
        console.log("Error creating album ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
   
}

export const deleteAlbum = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if(req.user?.role != "admin") {
            res.status(401).json({
                message: "You are not eligible"
            })
            return;
        }
        const { id } = req.params
        const album = await prisma.album.findUnique({
            where: {
                id: Number(id),
            }
        })
        if(!album) {
            res.status(404).json({
                message: "No album found"
            })
            return;
        }
        
        await prisma.album.delete({
            where: {
                id: Number(id),
            }
        })

        if(redisClient.isReady) {
            await redisClient.del("albums");
            console.log("Cache invalidate for albums");
        }
        res.status(200).json({
            message: "Album deleted successfully"
        })
    } catch (error) {
        console.log("Error deleting album ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
   
}

export const getAllAlbums = async(req: Request, res: Response) => {
    try {
        let albums;
        const CAHCHE_EXPIRE = 1800;
        if(redisClient.isReady) {
            albums = await redisClient.get("albums")
        }
        if(albums) {
            console.log("cache hit");
            res.json(JSON.parse(albums))            
            return;
        } else {
            albums = await prisma.album.findMany()
            if(redisClient.isReady) {
                await redisClient.set("albums", JSON.stringify(albums), {
                    EX: CAHCHE_EXPIRE
                })
            }
            res.status(200).json(albums)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getAllSongsOfAlbum = async(req: Request, res: Response) => {
    try {
        let albumSongs;
        const CAHCHE_EXPIRE = 1800
        const { id } = req.params
        // redisClient.del(`album_songs_${id}`);

        if(redisClient.isReady) {
            albumSongs = await redisClient.get(`album_songs_${id}`);
        }
        if(albumSongs) {
            console.log("cache hit");                       
            res.json(JSON.parse(albumSongs))
            return
        } else {
            albumSongs = await prisma.album.findUnique({
                where: {
                    id: Number(id),
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    thumbnail: true,
                    song: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnail: true,
                            albumId: true,
                            audio: true
                        }
                    }
                }
            });

            if(albumSongs?.song.length === 0 || !albumSongs?.song) {
                res.status(404).json({
                    message: "No songs available"
                })
                return
            }

            const albumDetails = {
                album: {
                    id: albumSongs.id,
                    title: albumSongs.title,
                    description: albumSongs.description,
                    thumbnail: albumSongs.thumbnail
                },
                songs: albumSongs.song
            }

            if(redisClient.isReady) {
                await redisClient.set(`album_songs_${id}`, JSON.stringify(albumDetails), {
                    EX: CAHCHE_EXPIRE
                })
            } 
            res.status(200).json(albumDetails)
        }        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Empty"
        })
    }
}
