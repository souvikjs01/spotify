import { Request, Response } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { AuthenticatedRequest } from "../middleware.js";
dotenv.config()

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        const user = await User.findOne({
            email,
        })
        if(user) {
            res.status(400).json({
                message: "User already exists"
            })
            return;
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            email,
            name,
            password: hashpassword
        })
        const token = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET as string, {
            expiresIn: "7d"
        })

        res.status(200).json({
            message: "User registered",
            newUser,
            token
        })
    } catch (error) {
        console.log("error while register" + error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({
            email,
        })
        if(!user) {
            res.status(404).json({
                message: "User not exists"
            })
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            res.status(404).json({
                message: "Invalid credentials"
            })
            return;
        }
        
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET as string, {
            expiresIn: "7d"
        })

        res.status(200).json({
            message: "User logged in",
            user,
            token
        })
    } catch (error) {
        console.log("error while register" + error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const userProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user
        res.status(200).json(user)
    } catch (error) {
        console.log("error while register" + error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}