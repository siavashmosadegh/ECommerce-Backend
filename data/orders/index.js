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

export {
    placeNewOrderData,
    getOrderDetailsData,
    updateOrderStatusData,
    getAllOrdersOfOneUserData,
    deleteOneOrderData
}