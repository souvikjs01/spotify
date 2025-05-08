import express from "express"
import { middleware } from "./middleware.js"
import { addAlbum } from "./controllers/album.js"
import uploadfile from "./lib/multer.js"

const router = express.Router()

router.post("/album/new", middleware, uploadfile, addAlbum)

export default router