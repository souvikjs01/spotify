import express from "express"
import { addToPlayList, loginUser, registerUser, userProfile } from "./controllers/user.js"
import { middleware } from "./middleware.js";

const router = express.Router()

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/me", middleware, userProfile);
router.post("/song/:id", middleware, addToPlayList);

export default router