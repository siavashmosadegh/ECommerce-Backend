'use strict';

import { request } from 'express';
import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
import pkg2 from 'bcryptjs';
import pkg3 from 'jsonwebtoken';
const {connect,sql,NVarChar,Int} = pkg;
const {hash, compare, compareSync} = pkg2;
const {sign} = pkg3

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

const loginUsersData = async (username, password) => {
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
        
        //check if user does not exist
        const existingUser = await pool.request()
            .input('username', NVarChar, username)
            .query(sqlQueries.checkUserExistanceViaUsername);

        if (existingUser.recordset.length === 0 ) {
            return "Login Failed: User Does Not Exist";
        }

        const user = existingUser.recordset[0];

        const isMatch = await compareSync(password, user.PasswordHash);

        console.log(`isMatch : ${isMatch}`);
        if (!isMatch) {
            return "Invalid Credentials: This Combination of Username & Password is Incorrect";
        }

        const token = sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        return token;
    } catch (error) {
        return error.message
    }
}

export {
    registerUsersData,
    loginUsersData
}