import {
    getProductsData,
    createNewProduct
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

export {
    getProducts,
    createProducts
}