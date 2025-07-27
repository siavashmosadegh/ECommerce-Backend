import express from 'express';
import { 
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    updateProfileName
} from '../controllers/userControllers.js';

const router = express.Router();

router.route("/profile/personal-info/update-name").post( authenticateToken, extractIdFromToken, updateProfileName);

export default router;