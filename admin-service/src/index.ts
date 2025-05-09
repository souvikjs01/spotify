import express from "express"
import dotenv from "dotenv"
import adminRoutes from "./routes.js";
import cloudinary from "cloudinary"
import { redisClient } from "./lib/redis.js";
import cors from "cors"

dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
redisClient.connect().then(() =>{
    console.log("Connected to redis")
}).catch((e) => {
    console.log(e);
})

const app = express()
app.use(cors())
const port = process.env.PORT || 8090
app.use(express.json())
app.use("/api/v1", adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on the port ${port}...`);
})