import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {placeNewOrderData} from "../data/orders/index.js";

const placeNewOrder = catchAsyncErrors( async (req, res) => {
    const id = req.userId;

    const data = req.body;

    const result = await placeNewOrderData(id , data);

    if (result === "Order Placed Successfully") {
        res.status(200).json({
            message: "Order Placed Successfully"
        })
    } else {
        res.json({
            message: "There was a problem placing the order"
        })
    }

    res.json({
        result
    });
})

export {
    placeNewOrder
}