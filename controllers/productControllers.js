import {
    getProductsData,
    createNewProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getReviewsOfOneProductData,
    addNewCategoryData,
    getCategoryData,
    getAllCategoriesData,
    getProductByCategoryIDData,
    getAllCarBrandsData,
    addNewCarBrandData,
    getCarBrandByCarBrandIDData,
    addNewProductTypeData,
    getProductTypeByCategoryIDData,
    createNewCarData,
    getCarByCarBrandIDData,
    createNewProductTypeBrandData,
    getAllProductTypeBrandsData,
    getProductFeaturesByProductIDData,
    getAllCarsData,
    createNewProductFeatureData
} from "../data/products/index.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

const getProducts = catchAsyncErrors( async (req, res, next) => {
    try {
        const products = await getProductsData(req.query.search);
        res.send(products);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

const createProducts = catchAsyncErrors( async (req, res, next) => {
    try {
        const data = req.body;
        const createdProduct = await createNewProduct(data);
        res.send(createdProduct);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// Get single product details : /api/v1/products/:id
const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;
        const oneProduct = await getProductById(productId);

        if (oneProduct == null || oneProduct.length == 0) {
            return next(new ErrorHandler('Product not found',404));
        }

        res.status(200).json({
            oneProduct
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// Update product details : /api/v1/product/:id
const updateProduct = catchAsyncErrors( async (req, res, next) => {
    const productId = req.params.id;
    const oneProduct = await getProductById(productId);

    if (oneProduct == null || oneProduct.length == 0) {
        return next(new ErrorHandler('Product not found',404));
    }

    const product = await updateProductById(productId, req.body);

    res.status(200).json({
        product
    })
})

// Delete product details : /api/v1/product/:id
const deleteProduct = catchAsyncErrors( async (req, res) => {
    const productId = req.params.id;
    const oneProduct = await getProductById(productId);

    if (oneProduct == null || oneProduct.length == 0) {
        return next(new ErrorHandler('Product not found',404));
    }

    await deleteProductById(productId);

    res.status(200).json({
        message: "Product is successfully deleted !!"
    })
})

const getReviewsOfOneProduct = catchAsyncErrors( async (req, res) => {
    const { productId } = req.params;

    const result = await getReviewsOfOneProductData( productId );

    res.json({
        result
    });
})

const addNewCategory = catchAsyncErrors( async (req, res) => {
    try {
        const data = req.body;
        const createdCategory = await addNewCategoryData(data);
        res.json({
            createdCategory
        });
    } catch (error) {
        res.json({
            error
        });
    }
})

const getCategory = catchAsyncErrors( async (req, res) => {
    try {
        const categoryID = req.params.id;

        const result = await getCategoryData(categoryID);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getAllCategories = catchAsyncErrors( async (req, res) => {
    try {
        const result = await getAllCategoriesData();

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const getProductByCategoryID = catchAsyncErrors ( async (req, res) => {
    try {
        const categoryID = req.params.id;

        const result = await getProductByCategoryIDData (categoryID);

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const getAllCarBrands = catchAsyncErrors ( async (req, res) => {
    try {

        const result = await getAllCarBrandsData ();

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const addNewCarBrand = catchAsyncErrors ( async (req, res) => {
    try {
        const data = req.body;

        const result = await addNewCarBrandData(data)

        res.json({
            result
        });

    } catch (error) {
        return error.message;
    }
})

const getCarBrandByCarBrandID = catchAsyncErrors ( async (req, res) => {
    try {
        
        const brandID = req.params.id;

        const result = await getCarBrandByCarBrandIDData(brandID);

        res.json({
            result
        });

    } catch (error) {
        return error.message;
    }
})

const addNewProductType = catchAsyncErrors (async (req, res) => {
    try {
        const data = req.body;

        const result = await addNewProductTypeData(data);

        res.json({
            result
        })

    } catch (error) {
        return error.message;
    }
})

const getProductTypeByCategoryID = catchAsyncErrors (async (req, res) => {
    try {
        const categoryID = req.params.id;

        const result = await getProductTypeByCategoryIDData(categoryID);

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const createNewCar = catchAsyncErrors (async (req, res) => {
    try {
        const data = req.body;

        const result = await createNewCarData(data);

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
});

const getCarByCarBrandID = catchAsyncErrors (async (req, res) => {
    try {
        const carBrandID = req.params.id;

        const result = await getCarByCarBrandIDData(carBrandID);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const createNewProductTypeBrand = catchAsyncErrors( async (req, res) => {
    try {
        const data = req.body;

        const result = await createNewProductTypeBrandData(data);

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const getAllProductTypeBrands = catchAsyncErrors (async (req, res) => {
    try {
        const result = await getAllProductTypeBrandsData();

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const getProductFeaturesByProductID = catchAsyncErrors( async(req, res) => {
    try {
        const productID = req.params.id;

        const result = await getProductFeaturesByProductIDData(productID);

        res.json({
            result
        })
    } catch (error) {
        return error.message;
    }
})

const getAllCars = catchAsyncErrors( async(req, res) => {
    try {
        
        const result = await getAllCarsData();

        res.json({
            result
        });

    } catch (error) {
        return error.message;
    }
})

const createNewProductFeature = catchAsyncErrors( async (req, res) => {
    try {
        const data = req.body;

        const result = await createNewProductFeatureData(data);

        res.json({
            result
        });

    } catch (error) {
        return error.message;
    }
})

export {
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
    createNewProductFeature
}