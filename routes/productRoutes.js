import express from 'express';
import {
    getProducts,
    createProducts,
    getProductDetails,
    updateProduct,
    deleteProduct
} from "../controllers/productControllers.js";
import {
    authenticateToken,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post( authenticateToken, authorizeRoles("admin") ,createProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put( authenticateToken, updateProduct);
router.route("/admin/products/:id").delete(authenticateToken, deleteProduct);

export default router;