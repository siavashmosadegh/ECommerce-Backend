import express from 'express';
import { 
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    placeNewOrder
} from '../controllers/orderControllers.js';

const router = express.Router();

router.route("/place-new-order").post( authenticateToken, extractIdFromToken ,placeNewOrder);

export default router;