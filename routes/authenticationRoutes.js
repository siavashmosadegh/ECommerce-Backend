import express from 'express';
import {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword
} from "../controllers/authenticationControllers.js";

const router = express.Router();

router.route("/register").post(registerUsers);
router.route("/login").post(loginUsers);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
export default router;