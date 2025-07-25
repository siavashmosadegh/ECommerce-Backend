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
    createNewProductFeatureData,
    getProductsBasedOnCarViaProductTypeIDData,
    getProductTypeByProductTypeIDData,
    getCarByCarIDData,
    getProductsByCarIdAndProductTypeIdData,
    getAllTrimLevelsOfCarByCarIdData,
    getProductTypeBrandNameByProductIdData,
    getProductQuantityByProductIdData,
    getCategoryByProductIDData,
    getProductTypeByProductIdData,
    getCarByProductIdData,
    getProductsBasedOnCarViaCategoryIDData,
    getProductsBulkData
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
        const categoryID = req.params.categoryId;

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
        const carBrandID = req.params.carBrandId;

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

const getProductsBasedOnCarViaProductTypeID = catchAsyncErrors( async (req, res) => {
    try {
        const productTypeID = req.params.productTypeID;

        const result = await getProductsBasedOnCarViaProductTypeIDData(productTypeID);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductTypeByProductTypeID = catchAsyncErrors (async (req, res) => {
    try {
        const productTypeID = req.params.id;

        const result = await getProductTypeByProductTypeIDData(productTypeID);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getCarByCarID = catchAsyncErrors( async (req, res) => {
    try {
        const carID = req.params.carId;

        const result = await getCarByCarIDData(carID);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductsByCarIdAndProductTypeId = catchAsyncErrors( async (req, res) => {
    try {
        const productTypeId = req.params.productTypeId;

        const carId = req.params.carId;

        const result = await getProductsByCarIdAndProductTypeIdData(productTypeId,carId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getAllTrimLevelsOfCarByCarId = catchAsyncErrors( async (req, res) => {
    try {
        const carId = req.params.carId;

        const result = await getAllTrimLevelsOfCarByCarIdData(carId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductTypeBrandNameByProductId = catchAsyncErrors( async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await getProductTypeBrandNameByProductIdData(productId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductQuantityByProductId = catchAsyncErrors( async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await getProductQuantityByProductIdData(productId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getCategoryByProductID = catchAsyncErrors( async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await getCategoryByProductIDData(productId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductTypeByProductId = catchAsyncErrors( async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await getProductTypeByProductIdData(productId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getCarByProductId = catchAsyncErrors( async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await getCarByProductIdData(productId);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductsBasedOnCarViaCategoryID = catchAsyncErrors( async (req, res) => {
    try {
        const categoryID = req.params.categoryID;

        const result = await getProductsBasedOnCarViaCategoryIDData(categoryID);

        res.json({
            result
        });
    } catch (error) {
        return error.message;
    }
})

const getProductsBasedOnCar = catchAsyncErrors( async (req, res) => {
    try {
        const { id } = req.params;
        const path = req.path;

        console.log(path);

        if (path.includes('/product-type/')) {

            const result = await getProductsBasedOnCarViaProductTypeIDData(id);

            res.json({
                result
            });

        } else if (path.includes('/category/')) {

            const result = await getProductsBasedOnCarViaCategoryIDData(id);

            res.json({
                result
            });
        }
    } catch (error) {
        return error.message;
    }
})

const getProductsBulk = catchAsyncErrors( async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty product ID list' });
        }
        // Assuming getProductsBulkData is a function that fetches products based on the provided IDs

        const products = await getProductsBulkData(ids);

        res.json({
            products
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
    createNewProductFeature,
    getProductsBasedOnCarViaProductTypeID,
    getProductTypeByProductTypeID,
    getCarByCarID,
    getProductsByCarIdAndProductTypeId,
    getAllTrimLevelsOfCarByCarId,
    getProductTypeBrandNameByProductId,
    getProductQuantityByProductId,
    getCategoryByProductID,
    getProductTypeByProductId,
    getCarByProductId,
    getProductsBasedOnCarViaCategoryID,
    getProductsBasedOnCar,
    getProductsBulk
}