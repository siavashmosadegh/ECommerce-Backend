import express from 'express';
import {
    authenticateToken,
    authorizeRoles,
    extractIdFromToken,
    validatePhoneNumber,
    validateOTPCode,
} from '../middlewares/auth.js';

const router = express.Router();

export default router;