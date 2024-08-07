import {getProductsData} from "../data/products/index.js";

const getProducts = async (req, res, next) => {
    try {
        const events = await getProductsData();
        res.send(events);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export {
    getProducts
}