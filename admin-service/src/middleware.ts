import axios from "axios";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}

interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const middleware = async(req: AuthenticatedRequest, res: Response, next:NextFunction) => {
    try {
        const token = req.headers.authorization as string
        if(!token) {
            res.status(403).json({
                message: "Please login"
            })
            return;
        }

        const { data } = await axios.get(`${process.env.USER_URL}/api/v1/user/me`, {
            headers: {
                Authorization: token
            }
        })

        req.user = data;
        next();
    } catch (error) {
        res.status(403).json({
            message: "Please login"
        })
    }
}