import express from 'express';
import {
    getProducts,
    createProducts
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(createProducts);

export default router;