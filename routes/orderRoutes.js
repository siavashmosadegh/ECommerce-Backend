import express from 'express';
import { 
    authenticateToken,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    placeNewOrder,
    getOrderDetails
} from '../controllers/orderControllers.js';

const router = express.Router();

router.route("/place-new-order").post( authenticateToken, extractIdFromToken ,placeNewOrder);
router.route("/get-order-details/:orderId").get( authenticateToken, getOrderDetails);

export default router;