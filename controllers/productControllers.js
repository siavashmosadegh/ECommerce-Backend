import {
    getProductsData,
    createNewProduct,
    getProductById,
    updateProductById,
    deleteProductById
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

export {
    getProducts,
    createProducts,
    getProductDetails,
    updateProduct,
    deleteProduct
}