'use strict';

import {loadSqlQueries} from '../utils.js';
import pkg from 'mssql';
const {
    connect,
    NVarChar,
    Int,
    Decimal,
    UniqueIdentifier
} = pkg;

const placeNewOrderData = async (id, data) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        // insert into orders table
        const result  = await pool.request()
            .input('UserID', Int, id)
            .input('totalPrice', Decimal(10,2), data.totalPrice)
            .input('shippingAddress', NVarChar(255), data.shippingAddress)
            .input('status', NVarChar(50), data.status)
            .query(sqlQueries.insertIntoOrders);

        const orderId = result.recordset[0].OrderId;

        // insert into OrderItems table
        const items = data.items;

        for (const item of items) {
            await pool.request()
                .input('OrderId', UniqueIdentifier, orderId)
                .input('ProductId', Int, item.productId)
                .input('Quantity', Int, item.quantity)
                .input('Price', Decimal(10,2), item.price)
                .query(sqlQueries.insertIntoOrderItems)
        }

        return "Order Placed Successfully"

    } catch (error) {
        return error.message;
    }
}

const getOrderDetailsData = async (orderId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        const orderResult = await pool.request()
            .input('OrderId', UniqueIdentifier, orderId)
            .query(sqlQueries.getOrderInfoFromOrders)

        if (orderResult.recordset.length == 0) {
            return "Order Not Found"
        }

        // get order items
        const itemResult = await pool.request()
            .input('OrderId', UniqueIdentifier, orderId)
            .query(sqlQueries.getOrderItemsInfoFromOrderItems);

        const result = {
            order: orderResult.recordset[0],
            items: itemResult.recordset
        }

        return result;

    } catch (error) {
        return error.message;
    }

}

const updateOrderStatusData = async (orderId, status) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        const existingOrder = await pool.request()
            .input('OrderId', NVarChar, orderId)
            .query(sqlQueries.checkOrderExistanceViaOrderID);

        if (existingOrder.recordset.length === 0 ) {
            return "Order Does Not Exist";
        }

        await pool.request()
            .input('OrderId', UniqueIdentifier, orderId)
            .input('Status', NVarChar(50), status)
            .query(sqlQueries.updateOrderStatus);

        return "Order Status Updated Successfully"

    } catch (error) {
        return error.message;
    }
}

const getAllOrdersOfOneUserData = async (userId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const authSqlQueries = await loadSqlQueries('authentication');
        const orderSqlQueries = await loadSqlQueries('orders');

        const existingUser = await pool.request()
            .input('id', Int, userId)
            .query(authSqlQueries.checkUserExistanceViaUserID);

        if (existingUser.recordset.length === 0 ) {
            return "User Does Not Exist";
        }

        const orders = await pool.request()
            .input('userId', Int , userId)
            .query(orderSqlQueries.getAllOrdersOfOneUserViaUserID);

        if (orders.recordset.length === 0) {
            return "This User Hasn't Placed Any Order Yet"
        }

        return orders.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteOneOrderData = async (orderId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        const existingOrder = await pool.request()
            .input('OrderId', NVarChar, orderId)
            .query(sqlQueries.checkOrderExistanceViaOrderID);

        if (existingOrder.recordset.length === 0 ) {
            return "Order Does Not Exist";
        }

        await pool.request()
            .input('OrderId', NVarChar, orderId)
            .query(sqlQueries.deleteOrderOrdersTableViaOrderID);

        await pool.request()
            .input('OrderId', NVarChar, orderId)
            .query(sqlQueries.deleteOrderItemsViaOrderID);

        return "Order Deleted Successfully";
    } catch (error) {
        return error.message;
    }
}

const getCartViaUserIDData = async (userID) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        const existingCart = await pool.request()
            .input('UserID', Int, userID)
            .query(sqlQueries.getCartViaUserID);

        if (existingCart.recordset.length === 0 ) {
            const insert = await pool.request()
                .input('UserID', Int, userID)
                .query(sqlQueries.insertIntoCartViaUserIdINITIALY);
            const value = { cartId: insert.recordset[0].CartId, items: [] }
            return value;
        } else {
            const cartId = existingCart.recordset[0].CartId;

            const items = await pool.request()
                .input('cartId', UniqueIdentifier, cartId)
                .query(sqlQueries.getCartItemsViaCartID);

            const value = {
                cartId: cartId,
                items: items.recordset
            }
            return (value);
        }
    } catch (error) {
        return error.message;
    }
}

const deleteEverythingFromCartItemsViaCartIdData = async (cartId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        await pool.request()
            .input('cartId', UniqueIdentifier, cartId)
            .query(sqlQueries.deleteEverythingFromCartItemsViaCartId);

    } catch (error) {
        return error.message;
    }
}

const getCartItemsViaCartIdData = async (cartId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        const existingOrder = await pool.request()
            .input('cartId', UniqueIdentifier, cartId)
            .query(sqlQueries.getCartItemsViaCartID);

        if (existingOrder.recordset.length === 0 ) {
            return "There is no product added to Cart";
        } else {
            return existingOrder.recordset
        }
    } catch (error) {
        return error.message;
    }
}

const decreaseProductQuantityInCartData = async (cartItemId, cartId, productId) => {
    try {
        let pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        const existingCartItem = await pool.request()
            .input('cartId', UniqueIdentifier, cartId)
            .input('cartItemId', Int, cartItemId)
            .input('productId', UniqueIdentifier, productId)
            .query(sqlQueries.getProductQuantityInCart);

        if (existingCartItem.recordset[0]?.Quantity !== 0 && existingCartItem.recordset[0]?.Quantity > 1) {
            const quantity = existingCartItem.recordset[0].Quantity - 1;

            await pool.request()
                .input('quantity', Int, quantity)
                .input('cartId', UniqueIdentifier, cartId)
                .input('cartItemId', Int, cartItemId)
                .input('productId', UniqueIdentifier, productId)
                .query(sqlQueries.updateProductQuantityInCart);
        } else if (existingCartItem.recordset[0]?.Quantity === 1) {

            await pool.request()
                .input('cartItemId', Int, cartItemId)
                .query(sqlQueries.deleteCartItemFromCartItems);

        } else if (existingCartItem.recordset.length === 0) {
            return "Quantity is equal to zero";
        }
    } catch (error) {
        return error.message;
    }
}

const increaseProductQuantityInCartData = async (cartId, productId) => {
    try {
        const pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        });

        const sqlQueries = await loadSqlQueries('orders');

        // 1️⃣ چک کنیم آیا محصول قبلاً توی سبد هست؟
        const checkExisting = await pool.request()
            .input('cartId', UniqueIdentifier, cartId)
            .input('productId', UniqueIdentifier, productId)
            .query(sqlQueries.getProductQuantityInCart);

        const existingItem = checkExisting.recordset[0];

        if (existingItem) {
            // افزایش تعداد
            const newQuantity = existingItem.Quantity + 1;
            await pool.request()
                .input('quantity', Int, newQuantity)
                .input('cartItemId', Int, existingItem.CartItemId)
                .query(sqlQueries.updateProductQuantityInCart);
        } else {
            // محصول جدید → تعداد = 1
            await pool.request()
                .input('cartId', UniqueIdentifier, cartId)
                .input('productId', UniqueIdentifier, productId)
                .input('quantity', Int, 1)
                .query(sqlQueries.insertIntoCartItemsForQuantityEqualToZero);
        }

        // 2️⃣ گرفتن کل سبد با جزییات محصول
        const fullCart = await pool.request()
            .input('cartId', UniqueIdentifier, cartId)
            .query(sqlQueries.getFullCartViaCartID);

        if (fullCart.recordset.length === 0) {
            return { message: "There is no product available in Cart" };
        }

        // 3️⃣ ساختن خروجی JSON ساختارمند
        const items = fullCart.recordset.map(row => ({
            CartId : row.CartId,
            CartItemId: row.CartItemId,
            CreatedAt : row.CartItemCreatedAt,
            ProductID : row.CartItemProductId,
            Quantity : row.Quantity,
            product : {
                CarID : row.CarID,
                CategoryID : row.CategoryID,
                CreatedAt : row.ProductCreatedAt,
                DeletedAt : row.DeletedAt,
                Description : row.Description,
                DiscountID : row.DiscountID,
                ModifiedAt : row.ModifiedAt,
                Price : row.Price,
                ProductID : row.ProductID,
                ProductInventoryID : row.ProductInventoryID, 
                ProductName : row.ProductName,
                ProductTypeBrandID : row.ProductTypeBrandID,
                SKU : row.SKU, 
                productIsOriginal : row.productIsOriginal,
                productTypeID : row.productTypeID
            }
        }));

        return items;

    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw new Error(error.message);
    }
};

export {
    placeNewOrderData,
    getOrderDetailsData,
    updateOrderStatusData,
    getAllOrdersOfOneUserData,
    deleteOneOrderData,
    getCartViaUserIDData,
    deleteEverythingFromCartItemsViaCartIdData,
    getCartItemsViaCartIdData,
    decreaseProductQuantityInCartData,
    increaseProductQuantityInCartData
}