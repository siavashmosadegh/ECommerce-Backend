import express from 'express';
import { 
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    placeNewReview
} from '../controllers/userReviewsControllers.js';

const router = express.Router();

router.route("/reviews/place-new-review").post( authenticateToken, extractIdFromToken, placeNewReview);

export default router;