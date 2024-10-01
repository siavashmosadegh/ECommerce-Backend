import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {placeNewOrderData} from "../data/orders/index.js";

const placeNewOrder = catchAsyncErrors( async (req, res) => {
    const id = req.userId;

    const data = req.body;

    const result = await placeNewOrderData(id , data);

    res.json({
        result
    });
})

export {
    placeNewOrder
}