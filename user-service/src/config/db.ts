import mongoose from "mongoose"
import dotenv from "dotenv"

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "Spotify"
        })
        console.log("Mongo db connected");
    } catch (error) {
        console.log("error connecting mongo db" + error);
    }
}