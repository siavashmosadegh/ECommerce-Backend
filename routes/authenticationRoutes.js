import express from 'express';
import {
    registerUsers,
    loginUsers
} from "../controllers/authenticationControllers.js";

const router = express.Router();

router.route("/register").post(registerUsers);
router.route("/login").post(loginUsers);

export default router;