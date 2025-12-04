'use strict';

import {loadSqlQueries} from '../utils.js';
import pkg from 'mssql';
const {
    connect,
    Int,
    NVarChar,
    Decimal,
    NChar
} = pkg;

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

const addAddressData = async (data, UserID, GuestID) => {
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

        // UserID, either this or below should not be null
        // GuestID, either this or above should not be null

        const {
            Line1, // not null
            City, // not null
            Label, // null
            Line2, // null
            Province, // null
            PostalCode, // null
            Latitude, // null
            Longitude, // null
            CountryCode, // not null but has default value
            IsDefault, // not null but has defalut value
            IsDeleted // not null but has default value
        } = data;

        console.log(UserID);
        console.log(GuestID);

        let query = `INSERT INTO Addresses (Line1, City`;
        let values = ` VALUES (@Line1, @City`;

        if (UserID) {
            query += `, UserID`;
            values += `, @UserID`;
        } else if (GuestID) {
            query += `, GuestID`;
            values += `, @GuestID`;
        } else {
            return "either UserID or GuestID must have value but not both"
        }

        if (Label) {
            query += `, Label`
            values += `, @Label`
        }

        if (Line2) {
            query += `, Line2`
            values += `, @Line2`
        }

        if (Province) {
            query += `, Province`
            values += `, @Province`
        }

        if (PostalCode) {
            query += `, PostalCode`
            values += `, @PostalCode`
        }

        if (Latitude) {
            query += `, Latitude`,
            values += `, @Latitude`
        }

        if (Longitude) {
            query += `, Longitute`,
            values += `, @Longitute`
        }

        if (CountryCode) {
            query += `, CountryCode`,
            values += `, @CountryCode`
        }

        if (IsDefault) {
            query += `, IsDefault`,
            values += `, @IsDefault`
        }

        if (IsDeleted) {
            query += `, IsDeleted`,
            values += `, @IsDeleted`
        }

        query += `)`;
        values += `)`;

        const finalQuery = query + values;

        const addressRequest = pool.request();

        addressRequest.input('Line1', NVarChar(255), Line1);
        addressRequest.input('City', NVarChar(120), City);

        if (UserID) {
            addressRequest.input('UserID', Int, UserID);
        } else if (GuestID) {
            addressRequest.input('GuestID', Int , GuestID);
        } else {
            return "either UserID or GuestID must have value but not both"            
        }

        if (Label) {
            addressRequest.input('Label', NVarChar(50), Label);
        }

        if (Line2) {
            addressRequest.input('Line2', NVarChar(255), Line2);
        }

        if (Province) {
            addressRequest.input('Province', NVarChar(120), Province);
        }

        if (PostalCode) {
            addressRequest.input('PostalCode', NVarChar(20), PostalCode);
        }

        if (Latitude) {
            addressRequest.input('Latitude', Decimal(9,6), Latitude);
        }

        if (Longitude) {
            addressRequest.input('Longitude', Decimal(9,6), Longitude);
        }

        if (CountryCode) {
            addressRequest.input('CountryCode', NChar(2), CountryCode);
        }

        if (IsDefault) {
            addressRequest.input('IsDefault', Bit, IsDefault);
        }

        if (IsDeleted) {
            addressRequest.input('IsDeleted', Bit, IsDeleted);
        }

        await addressRequest.query(finalQuery);

        //return result.recordset;

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

const updateNationalCodeData = async (nationalCode , userId) => {
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
            .input('nationalCode', NVarChar(10), nationalCode)
            .query(usersSqlQueries.updateNationalCode);

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
    updateBirthInfoData,
    updateNationalCodeData
}