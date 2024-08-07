'use strict';

import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
const {connect} = pkg;

const getProductsData = async () => {
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
        const sqlQueries = await loadSqlQueries('products');
        const list = await pool.request().query(sqlQueries.productslist);
        return list.recordset;
    } catch (error) {
        return error.message
    }
}

export {
    getProductsData
}