import express from 'express';
import {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    getAllUsers,
    getUser,
    deleteUser
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

router.route("/admin/get-all-users").get(authenticateToken, authorizeRoles("admin"), getAllUsers);
router.route("/admin/get-user/:id").get( authenticateToken, authorizeRoles("admin"), getUser);
router.route("/admin/delete-user/:id").delete( authenticateToken, authorizeRoles("admin"), deleteUser);

export default router;