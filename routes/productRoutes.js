import express from 'express';
import {
    getProducts,
    createProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    getReviewsOfOneProduct,
    addNewCategory,
    getCategory,
    getAllCategories,
    getProductByCategoryID
} from "../controllers/productControllers.js";
import {
    authenticateToken,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/products/get-all-categories").get( getAllCategories )

router.route("/products").get(getProducts);
router.route("/admin/products").post( authenticateToken, authorizeRoles("admin") ,createProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put( authenticateToken, authorizeRoles("admin") , updateProduct);
router.route("/admin/products/:id").delete(authenticateToken, authorizeRoles("admin") , deleteProduct);

router.route("/products/:productId/reviews").get( getReviewsOfOneProduct )

router.route("/admin/products/add-new-category").post( authenticateToken, authorizeRoles("admin"), addNewCategory);
router.route("/admin/products/get-category/:id").get( authenticateToken, authorizeRoles("admin"), getCategory);

router.route("/products/category/:id").get( getProductByCategoryID )


export default router;