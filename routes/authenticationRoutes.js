import express from 'express';
import {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    getAllUsers
} from "../controllers/authenticationControllers.js";
import {
    authenticateToken,
    authorizeRoles,
    extractIdFromToken
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/register").post(registerUsers);
router.route("/login").post(loginUsers);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.route("/user-profile").get( authenticateToken, extractIdFromToken, getUserProfile);
router.route("/update-password").post( authenticateToken, extractIdFromToken, updatePassword);

router.route("/get-all-users").get(authenticateToken, authorizeRoles("admin"), getAllUsers);
export default router;