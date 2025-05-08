import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import { IUser, User } from "./models/user.js";
dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: IUser | null
}

export const middleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            res.status(403).json({
                message: "Please login"
            })
            return;
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        if(!decodedValue || !decodedValue._id) {
            res.status(403).json({
                message: "Invalid token"
            })
            return;
        }

        const userId = decodedValue._id
        const user = await User.findById(userId).select("-password");

        if(!user) {
            res.status(403).json({
                message: "User not found"
            })
            return;
        }

        req.user = user
        next();
    } catch (error) {
        console.log("internal server error " + error);
        res.status(500).json({
            message: "Please login"
        })
    }
}
