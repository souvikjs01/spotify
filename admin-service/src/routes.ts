import express from "express"
import { middleware } from "./middleware.js"
import { addAlbum, deleteAlbum, getAllAlbums, getAllSongsOfAlbum } from "./controllers/album.js"
import uploadfile from "./lib/multer.js"
import { addSong, addThumbnail, deleteSong, getAllSongs, getSingleSong } from "./controllers/song.js"

const router = express.Router()

router.post("/album/new", middleware, uploadfile, addAlbum);
router.post("/song/new", middleware, uploadfile, addSong);
router.post("/song/:id", middleware, uploadfile, addThumbnail);
router.delete("/album/:id", middleware, uploadfile, deleteAlbum)
router.delete("/song/remove/:id", middleware, uploadfile, deleteSong)

// song service:
router.get("/album/all", getAllAlbums);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbum);
router.get("/song/:id", getSingleSong);

export default router