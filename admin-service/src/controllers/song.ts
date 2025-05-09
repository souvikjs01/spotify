import { Request, Response } from "express";
import getBuffer from "../lib/datauri.js";
import cloudinary from "cloudinary"
import prisma from "../config/prisma.js";
import { AuthenticatedRequest } from "./album.js";

export const addSong = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if(req.user?.role !== "admin") {
            res.status(401).json({
                message: "You are not eligible"
            })
            return
        }
    
        const { title, description, albumId } = req.body

        const isAlbum = await prisma.album.findUnique({
            where: {
                id: albumId
            }
        })

        if(!isAlbum) {
            res.status(404).json({
                message: "No album with this id"
            })
            return
        }

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
            folder: "songs",
            resource_type: "video"
        });
    
        const result = await prisma.song.create({
            data: {
                title,
                description,
                audio: cloud.secure_url,
                albumId,
            }
        })
    
        res.status(200).json({
            message: "Song added",
        })
    } catch (error) {
        console.log("Error creating album ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
   
}

export const addThumbnail = async(req: AuthenticatedRequest, res: Response) => {
    try {
        if(req.user?.role !== "admin") {
            res.status(401).json({
                message: "You are not eligible"
            })
            return
        }
        const songId = req.params.id;
        const audio = await prisma.song.findUnique({
            where: {
                id: songId
            }
        })

        if(!songId) {
            res.status(404).json({
                message: "No song with this id"
            })
            return;
        }

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
    
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);
    
        const result = await prisma.song.update({
            where: {
                id: songId
            },
            data: {
                thumbnail: cloud.secure_url
            }
        })

        res.status(200).json({
            message: "Thumbnail added",
            song: result
        })
    } catch (error) {
        console.log("Error updating thumbnail", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteSong = async(req: AuthenticatedRequest, res: Response) => {
    try {
        if(req.user?.role !== "admin") {
            res.status(401).json({
                message: "You are not eligible"
            })
            return
        }
        const songId = req.params.id;

        const audio = await prisma.song.findUnique({
            where: {
                id: songId
            }
        })
        if(!songId) {
            res.status(404).json({
                message: "No song with this id"
            })
            return;
        }

        await prisma.song.delete({
            where: {
                id: songId
            }
        })
        res.status(200).json({
            message: "Song deleted successfully",
        })

    } catch (error) {
        console.log("Error deleting song", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


export const getAllSongs = async(req: Request, res: Response) => {
    try {
        const songs = await prisma.song.findMany();
        res.status(200).json(songs)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getSingleSong = async(req: Request, res: Response) => {
    try {
        const { id } = req.params
        const song = await prisma.song.findUnique({
            where: {
                id,
            }
        })
        res.status(200).json(song)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}