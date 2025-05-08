import express from "express"
import { loginUser, registerUser, userProfile } from "./controllers/user.js"
import { middleware } from "./middleware.js";

const router = express.Router()

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/me", middleware, userProfile);

export default router