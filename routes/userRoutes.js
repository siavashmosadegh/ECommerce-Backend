import express from 'express';
import { 
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    updateProfileName,
    getUserProfile
} from '../controllers/userControllers.js';

const router = express.Router();

router.route("/profile/personal-info/update-name").post( authenticateToken, extractIdFromToken, updateProfileName);

router.route("/profile/get-user-profile").get( authenticateToken, extractIdFromToken, getUserProfile);

export default router;