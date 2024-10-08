import express from 'express';
import { 
    authenticateToken,
    authorizeRoles,
    extractIdFromToken
} from '../middlewares/auth.js';

import {
    placeNewOrder,
    getOrderDetails,
    updateOrderStatus,
    getAllOrdersOfOneUser,
    deleteOneOrder
} from '../controllers/orderControllers.js';

const router = express.Router();

router.route("/order/place-new-order").post( authenticateToken, extractIdFromToken ,placeNewOrder);
router.route("/order/get-order-details/:orderId").get( authenticateToken, getOrderDetails);
router.route("/admin/order/update-order-status/:orderId").put( authenticateToken, authorizeRoles("admin"), updateOrderStatus);
router.route("/order/get-all-orders-of-one-user/:userId").get( authenticateToken , getAllOrdersOfOneUser);
router.route("/admin/order/delete-one-order/:orderId").delete( authenticateToken, authorizeRoles("admin"), deleteOneOrder);

export default router;