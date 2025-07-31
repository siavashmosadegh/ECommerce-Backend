import express from 'express';
import { 
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    updateProfileName,
    getUserProfile,
    addAddress,
    updateBirthInfo
} from '../controllers/userControllers.js';

const router = express.Router();

router.route("/profile/personal-info/update-name").post( authenticateToken, extractIdFromToken, updateProfileName);

router.route("/profile/get-user-profile").get( authenticateToken, extractIdFromToken, getUserProfile);

router.route("/profile/addresses/add-address").post( authenticateToken, extractIdFromToken, addAddress );

router.route("/profile/personal-info/update-birth-info").post( authenticateToken, extractIdFromToken, updateBirthInfo );

export default router;