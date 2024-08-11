import express from 'express';
import {
    getProducts,
    createProducts,
    getProductDetails,
    updateProduct
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(createProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(updateProduct);

export default router;