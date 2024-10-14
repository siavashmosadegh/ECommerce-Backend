'use strict';

import {loadSqlQueries} from '../utils.js';
import pkg from 'mssql';
const {connect,Int, Text} = pkg;

const placeNewReviewData = async (userId, productId, rating, reviewText) => {
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
        const reviewSqlQueries = await loadSqlQueries('userReviews');
        const productSqlQueries = await loadSqlQueries('products');

        const existingProduct = await pool.request()
            .input('productId', Int, productId)
            .query(productSqlQueries.checkProductExistance);

        console.log(existingProduct);

        if (existingProduct.recordset.length === 0 ) {
            return "This Product Does Not Exist";
        }

        const insertUserReview = await pool.request()
                                        .input('userId', Int, userId)
                                        .input('productId', Int, productId)
                                        .input('rating', Int, rating)
                                        .input('reviewText', Text, reviewText)
                                        .query(reviewSqlQueries.insertUserReviewIntoUserReviewTable);

        return insertUserReview.recordset;
    } catch (error) {
        return error.message;
    }
}

export {
    placeNewReviewData
}