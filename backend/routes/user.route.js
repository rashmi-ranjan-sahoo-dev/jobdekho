import {register, login, updateProfile} from "../controllers/user.controller.js";
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import express from "express";
import { singleUpload } from "../middleware/mutler.js";

const router = express.Router();

router.post("/register",register)
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;