'use strict';

import {loadSqlQueries} from '../utils.js';
import pkg from 'mssql';
const {
    connect,
    NVarChar,
    Int,
    Decimal
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

        const result  = await pool.request()
            .input('UserID', Int, id)
            .input('totalPrice', Decimal(10,2), data.totalPrice)
            .input('shippingAddress', NVarChar(255), data.shippingAddress)
            .input('status', NVarChar(50), data.status)
            .query(sqlQueries.insertIntoOrders);

        const orderId = result.recordset[0].OrderId;
    } catch (error) {
        return error.message;
    }
}

export {
    placeNewOrderData
}