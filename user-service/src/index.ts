import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import userRoutes from "./routes.js";
import cors from "cors"

dotenv.config()
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
connectDB()

app.use(express.json())
app.use("/api/v1", userRoutes);


app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})