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
    getProductFeaturesByProductID,
    getAllCars,
    createNewProductFeature,
    getProductsBasedOnCarViaProductTypeID,
    getProductTypeByProductTypeID,
    getCarByCarID,
    getProductsByCarIdAndProductTypeId,
    getAllTrimLevelsOfCarByCarId,
    getProductTypeBrandNameByProductId,
    getProductQuantityByProductId,
    getCategoryByProductID
} from "../controllers/productControllers.js";
import {
    authenticateToken,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.route("/products/get-all-categories").get( getAllCategories );
router.route("/products/get-all-car-brands").get( getAllCarBrands );
router.route("/car/get-all-cars").get( getAllCars );

router.route("/products").get(getProducts);
router.route("/admin/products").post( authenticateToken, authorizeRoles("admin") ,createProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put( authenticateToken, authorizeRoles("admin") , updateProduct);
router.route("/admin/products/:id").delete(authenticateToken, authorizeRoles("admin") , deleteProduct);

router.route("/products/:productId/reviews").get( getReviewsOfOneProduct );

router.route("/admin/products/add-new-category").post( authenticateToken, authorizeRoles("admin"), addNewCategory);
router.route("/products/get-category/:id").get( getCategory );
router.route("/products/category/get-category-by-product-id/:productId").get( getCategoryByProductID );

router.route("/admin/products/add-new-car-brand").post( authenticateToken, authorizeRoles("admin"), addNewCarBrand );
router.route("/products/get-car-brand/:id").get( getCarBrandByCarBrandID );

router.route("/products/category/:id").get( getProductByCategoryID );

router.route("/admin/productType/add-new-product-type").post( authenticateToken, authorizeRoles("admin"), addNewProductType );
router.route("/productType/get-product-type-by-category-id/:categoryId").get( getProductTypeByCategoryID );
router.route("/productType/get-product-type-by-id/:id").get( getProductTypeByProductTypeID );

router.route("/admin/car/create-new-car").post( authenticateToken, authorizeRoles("admin"), createNewCar );
router.route("/car/get-car-by-car-brand-id/:id").get( getCarByCarBrandID );
router.route("/car/get-car-by-car-id/:id").get( getCarByCarID )

router.route("/admin/product-type-brand/create-new-brand").post( authenticateToken, authorizeRoles("admin"), createNewProductTypeBrand );
router.route("/product-type-brand/get-all").get( getAllProductTypeBrands );
router.route("/product-type-brand/get-brand-by-product-id/:productId").get( getProductTypeBrandNameByProductId );

router.route("/product-features/:id").get( getProductFeaturesByProductID );
router.route("/admin/product-features/create-new-product-features").post( authenticateToken, authorizeRoles("admin"), createNewProductFeature );

router.route("/product-category/:productTypeID").get( getProductsBasedOnCarViaProductTypeID );

router.route("/product/car-brand/get-products-carId-productTypeId/:productTypeId/:carId").get( getProductsByCarIdAndProductTypeId );

router.route("/product/car-brand/get-trimlevels-by-carId/:carId").get( getAllTrimLevelsOfCarByCarId );

router.route("/product-inventory/get-product-quantity/:productId").get( getProductQuantityByProductId );

export default router;