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
    getProductByCategoryID,
    getAllCarBrands,
    addNewCarBrand,
    getCarBrandByCarBrandID,
    addNewProductType,
    getProductTypeByCategoryID,
    createNewCar,
    getCarByCarBrandID,
    createNewProductTypeBrand,
    getAllProductTypeBrands,
    getProductFeaturesByProductID
} from "../controllers/productControllers.js";
import {
    authenticateToken,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/products/get-all-categories").get( getAllCategories );
router.route("/products/get-all-car-brands").get( getAllCarBrands );

router.route("/products").get(getProducts);
router.route("/admin/products").post( authenticateToken, authorizeRoles("admin") ,createProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put( authenticateToken, authorizeRoles("admin") , updateProduct);
router.route("/admin/products/:id").delete(authenticateToken, authorizeRoles("admin") , deleteProduct);

router.route("/products/:productId/reviews").get( getReviewsOfOneProduct );

router.route("/admin/products/add-new-category").post( authenticateToken, authorizeRoles("admin"), addNewCategory);
router.route("/products/get-category/:id").get( getCategory );

router.route("/admin/products/add-new-car-brand").post( authenticateToken, authorizeRoles("admin"), addNewCarBrand );
router.route("/products/get-car-brand/:id").get( getCarBrandByCarBrandID );

router.route("/products/category/:id").get( getProductByCategoryID );

router.route("/admin/productType/add-new-product-type").post( authenticateToken, authorizeRoles("admin"), addNewProductType );
router.route("/productType/get-product-type-by-category-id/:id").get( getProductTypeByCategoryID );

router.route("/admin/car/create-new-car").post( authenticateToken, authorizeRoles("admin"), createNewCar );
router.route("/car/get-car-by-car-brand-id/:id").get( getCarByCarBrandID );

router.route("/admin/product-type-brand/create-new-brand").post( authenticateToken, authorizeRoles("admin"), createNewProductTypeBrand );
router.route("/product-type-brand/get-all").get( getAllProductTypeBrands );

router.route("/product-features/:id").get( getProductFeaturesByProductID );


export default router;