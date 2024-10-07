import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {
    placeNewOrderData,
    getOrderDetailsData
} from "../data/orders/index.js";

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

const getOrderDetails = catchAsyncErrors( async (req, res) => {

    const orderId = req.params.orderId;

    const result = await getOrderDetailsData(orderId);

    if (result === "Order Not Found") {
        res.json({
            message: "Order Not Found"
        })
    } else {
        res.json({
            result
        })
    }
})

export {
    placeNewOrder,
    getOrderDetails
}