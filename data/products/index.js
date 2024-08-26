'use strict';

import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
const {connect,sql,NVarChar,Int} = pkg;

const getProductsData = async (search) => {
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
        let list = null;
        if (search !== null && search !== undefined) {
            list = await pool.request()
                            .input('ProductName', NVarChar(100), search)
                            .query(sqlQueries.searchProduct);
        } else if (search === undefined) {
            list = await pool.request().query(sqlQueries.productslist);
        }
        return list.recordset;
    } catch (error) {
        return error.message
    }
}

const createNewProduct = async (productData) => {
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
        })
        const sqlQueries = await loadSqlQueries('products');
        const insertProduct = await pool.request()
                                    .input('ProductName', NVarChar(100), productData.ProductName)
                                    .input('Description', NVarChar(100), productData.Description)
                                    .input('SKU', NVarChar(100), productData.SKU)
                                    .input('CategoryID', Int(), productData.CategoryID)
                                    .input('InventoryID', Int(), productData.InventoryID)
                                    .input('Price', Int(), productData.Price)
                                    .input('DiscountID', Int(), productData.DiscountID)
                                    .query(sqlQueries.createproduct);
        return insertProduct.recordset;
    } catch (error) {
        return error.message
    }
}

const getProductById = async (productId) => {
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
        const oneProduct = await pool.request()
                                .input('productId', Int(), productId)
                                .query(sqlQueries.productById);
        return oneProduct.recordset;
    } catch (error) {
        return error.message;
    }
}

const updateProductById = async (productId, productData) => {
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
        const update = await pool.request()
                                    .input('ProductId', Int(), productId)
                                    .input('ProductName', NVarChar(100), productData.ProductName)
                                    .input('Description', NVarChar(100), productData.Description)
                                    .input('SKU', NVarChar(100), productData.SKU)
                                    .input('CategoryID', Int(), productData.CategoryID)
                                    .input('InventoryID', Int(), productData.InventoryID)
                                    .input('Price', Int(), productData.Price)
                                    .input('DiscountID', Int(), productData.DiscountID)
                                    .query(sqlQueries.updateProduct);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteProductById = async (productId) => {
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
        const deleted = await pool.request()
                                .input('productId', Int(), productId)
                                .query(sqlQueries.deleteProduct);
        return deleted.recordset;

    } catch (error) {
        return error.message;
    }
}

export {
    getProductsData,
    createNewProduct,
    getProductById,
    updateProductById,
    deleteProductById
}