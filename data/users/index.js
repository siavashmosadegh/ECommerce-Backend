'use strict';

import {loadSqlQueries} from '../utils.js';
import pkg from 'mssql';
const {connect, Int, NVarChar} = pkg;

const updateProfileNameData = async (firstName , lastName, userId) => {
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

        const usersSqlQueries = await loadSqlQueries('users');

        const result = await pool.request()
            .input('userId', Int, userId)
            .input('firstName', NVarChar(100), firstName)
            .input('lastName', NVarChar(100),lastName)
            .query(usersSqlQueries.updateFirstNameAndLastName);

        console.log(result);

        return result.recordset;

    } catch (error) {
        return error.message;
    }
}

export {
    updateProfileNameData
}