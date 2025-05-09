import { Request, Response } from "express";
import getBuffer from "../lib/datauri.js";
import cloudinary from "cloudinary"
import prisma from "../config/prisma.js";


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
                id,
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
                id,
            }
        })

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
        const albums = await prisma.album.findMany()
        res.status(200).json(albums)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getAllSongsOfAlbum = async(req: Request, res: Response) => {
    try {
        const { id } = req.params
        const albumSongs = await prisma.album.findUnique({
            where: {
                id,
            },
            select: {
                song: true
            }
        })
        if(albumSongs?.song.length === 0 || !albumSongs?.song) {
            res.status(404).json({
                message: "No songs available"
            })
            return
        }
        res.status(200).json(albumSongs.song)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Empty"
        })
    }
}
