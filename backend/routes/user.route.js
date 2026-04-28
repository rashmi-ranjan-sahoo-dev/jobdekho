import {register, login, pudateProfile} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js"
import express from "express";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile/update").post(isAutehnticated,updateProfile);

export default router;