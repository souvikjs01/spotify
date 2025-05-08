import express from "express"
import dotenv from "dotenv"
import adminRoutes from "./routes.js";
import cloudinary from "cloudinary"
dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const port = process.env.PORT || 8090
app.use(express.json())
app.use("/api/v1", adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on the port ${port}...`);
})