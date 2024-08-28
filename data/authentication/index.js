'use strict';

import { request } from 'express';
import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
import pkg2 from 'bcryptjs';
const {connect,sql,NVarChar,Int} = pkg;
const {hash} = pkg2;

const registerUsersData = async (username, email, password) => {
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
        
        //check if user already exists
        const existingUser = await pool.request()
            .input('Email', NVarChar, email)
            .query(sqlQueries.checkUserExistance);

        if (existingUser.recordset.length > 0 ) {
            return "User Already Exists";
        }

        //Hash the password
        // const salt = await genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const hashedPassword = await hash(password,10);
        console.log(hashedPassword);

        console.log(`username: ${username}, email: ${email}, password: ${hashedPassword}`)
        // Insert user into database
        await pool.request() 
            .input('username', NVarChar, username)
            .input('email', NVarChar, email)
            .input('passwordHash', NVarChar, hashedPassword)
            .query('INSERT INTO Users (UserName, Email, PasswordHash) VALUES (@username, @email, @passwordHash)');

        return "User registered Successfully";
    } catch (error) {
        return error.message
    }
}

export {
    registerUsersData
}