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

const getUserProfileData = async (userId) => {
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

        const sqlQueries = await loadSqlQueries('authentication');

        console.log(userId);

        const record = await pool.request()
            .input("userId", Int, userId)
            .query(sqlQueries.getUserViaUserID);
        
        console.log(record);

        return record.recordset[0];

    } catch (error) {
        return error.message;
    }
}

const addAddressData = async (postalAddress, addressHouseNumber, addressUnitNumber, zipCode, userId) => {
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
            .input('postalAddress', NVarChar(255), postalAddress)
            .input('addressHouseNumber', Int, addressHouseNumber)
            .input('addressUnitNumber', Int,addressUnitNumber)
            .input('zipCode', NVarChar(20), zipCode)
            .query(usersSqlQueries.updateAddress);

        console.log(result);

        return result.recordset;

    } catch (error) {
        return error.message;
    }
}

const updateBirthInfoData = async (birthDay, birthMonth, birthYear, userId) => {
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
            .input('birthDay', Int, birthDay)
            .input('birthMonth', Int, birthMonth)
            .input('birthYear', Int,birthYear)
            .query(usersSqlQueries.updateBirthInfo);

        console.log(result);

        return result.recordset;

    } catch (error) {
        return error.message;
    }
}

export {
    updateProfileNameData,
    getUserProfileData,
    addAddressData,
    updateBirthInfoData
}