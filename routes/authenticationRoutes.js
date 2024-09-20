import express from 'express';
import {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    getUserProfile
} from "../controllers/authenticationControllers.js";
import {
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/register").post(registerUsers);
router.route("/login").post(loginUsers);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.route("/user-profile").get( authenticateToken, extractIdFromToken, getUserProfile)
export default router;