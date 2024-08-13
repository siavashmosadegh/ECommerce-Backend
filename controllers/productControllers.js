import {
    getProductsData,
    createNewProduct,
    getProductById,
    updateProductById,
    deleteProductById
} from "../data/products/index.js";

const getProducts = async (req, res, next) => {
    try {
        const events = await getProductsData();
        res.send(events);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const createProducts = async (req, res, next) => {
    try {
        const data = req.body;
        const createdProduct = await createNewProduct(data);
        res.send(createdProduct);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Get single product details : /api/v1/products/:id
const getProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        const oneProduct = await getProductById(productId);
        res.send(oneProduct);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Update product details : /api/v1/product/:id
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const oneProduct = await getProductById(productId);

    if (!oneProduct) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    const product = await updateProductById(productId, req.body);

    res.status(200).json({
        product
    })

}

// Delete product details : /api/v1/product/:id
const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const oneProduct = await getProductById(productId);

    if (oneProduct == null || oneProduct.length == 0) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    await deleteProductById(productId);

    res.status(200).json({
        message: "Product is successfully deleted !!"
    })
}

export {
    getProducts,
    createProducts,
    getProductDetails,
    updateProduct,
    deleteProduct
}