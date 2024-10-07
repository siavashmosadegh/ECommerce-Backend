import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {
    placeNewOrderData,
    getOrderDetailsData,
    updateOrderStatusData
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

const updateOrderStatus = catchAsyncErrors( async (req, res) => {

    const orderId = req.params.orderId;

    const {status} = req.body;

    console.log(orderId);

    const result = await updateOrderStatusData(orderId, status);

    if (result === "Order Does Not Exist") {
        res.json({
            message: "Order Does Not Exist"
        })
    } else if (result === "Order Status Updated Successfully") {
        res.json({
            message: "Order Status Updated Successfully"
        })
    }
})

export {
    placeNewOrder,
    getOrderDetails,
    updateOrderStatus
}