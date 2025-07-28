import express from 'express';
import {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    updatePassword,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    loginUsersWithPhone,
    loginRequestOTP,
    loginVerifyOTP
} from "../controllers/authenticationControllers.js";
import {
    authenticateToken,
    authorizeRoles,
    extractIdFromToken,
    validatePhoneNumber,
    validateOTPCode,
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/register/via-user-pass").post(registerUsers);
router.route("/login/via-user-pass").post(loginUsers);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);


router.route("/update-password").post( authenticateToken, extractIdFromToken, updatePassword);

router.route("/admin/get-all-users").get(authenticateToken, authorizeRoles("admin"), getAllUsers);
router.route("/admin/get-user/:id").get( authenticateToken, authorizeRoles("admin"), getUser);
router.route("/admin/delete-user/:id").delete( authenticateToken, authorizeRoles("admin"), deleteUser);
router.route("/admin/update-user/:id").patch( authenticateToken, authorizeRoles("admin"), updateUser);

router.route("/login/via-phone").post( validatePhoneNumber, loginUsersWithPhone);

router.route("/login/request-otp").post( validatePhoneNumber, loginRequestOTP );
router.route("/login/verify-otp").post(validatePhoneNumber, validateOTPCode, loginVerifyOTP);

export default router;