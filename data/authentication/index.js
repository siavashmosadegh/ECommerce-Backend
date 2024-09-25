'use strict';

import { request } from 'express';
import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
import pkg2 from 'bcryptjs';
import pkg3 from 'jsonwebtoken';
const {connect,sql,NVarChar,DateTime,Int} = pkg;
const {hash, compare, compareSync} = pkg2;
const {sign} = pkg3;
import { v4 as uuidv4 } from 'uuid';
import sendResetEmail from '../../middlewares/email.js';

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
            .input('role', NVarChar, "admin")
            .query(sqlQueries.registerInsertUser);

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

        const token = sign({ id: user.UserID , role: user.Role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        return token;
    } catch (error) {
        return error.message
    }
}

const forgotPasswordData = async (username) => {
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

        // Generate a unique reset token and expiry time (e.g., 1 hour from now)
        const resetToken = uuidv4();
        const resetTokenExpiry = new Date(Date.now() + 10000); // 1 hour
        const user = existingUser.recordset[0];

        console.log(`reset token : ${resetToken}`)

        try {
            await pool.request()
                .input('username', NVarChar, user.UserName)
                .input('reset_token', NVarChar, resetToken)
                .input('reset_token_expiry', DateTime, resetTokenExpiry)
                .query(sqlQueries.insertResetTokenAndResetTokenExpiry);

            await sendResetEmail(user, resetToken);
            return "Password Reset Email Was Sent Successfully";
        } catch (error) {
            return error.message;
        }

    } catch (error) {
        return error.message;
    }
}

const resetPasswordData = async (token, newPassword) => {
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

        const record = await pool.request()
            .input("token", NVarChar, token)
            .query(sqlQueries.getUsersEmailAndResetTokenExpire);

        if (record.recordset.length === 0) {
            return "Invalid or Expired Token"
        }

        const { Email, reset_token_expiry } = record.recordset[0];

        console.log(`email : ${Email}`);
        console.log(`resetTokenExpiry: ${reset_token_expiry}`);

        if (new Date(reset_token_expiry) < new Date()) {
            return "Token has expired";
        }

        const hashedPassword = await hash(newPassword,10);

        // Update password in the database and clear the reset token
        try {
            await pool.request()
                .input("email", NVarChar, Email)
                .input("hashedPassword", NVarChar, hashedPassword)
                .query(sqlQueries.updatePasswordAndClearResetToken);

            return "Password has been reset successfully";
        } catch (error) {
            return error.message;
        }

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

const updatePasswordData = async (userId, newPassword) => {
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

        const hashedPassword = await hash(newPassword, 10);

        try {
            await pool.request() 
                .input('userId', Int, userId)
                .input('hashedPassword', NVarChar, hashedPassword)
                .query(sqlQueries.updatePasswordWhenLoggedIn);

            return ("Your Password was Updated Successfully");
        } catch (error) {
            return (error.message);
        }
    } catch (error) {
        return error.message;
    }
}

const getAllUsersData = async () => {
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

        try {
            const result = await pool.request()
                .query(sqlQueries.getAllUsers);

            return result.recordset;
        } catch (error) {
            return (error.message);
        }
    } catch (error) {
        return error.message;
    }
}

const getUserData = async (id) => {
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

        try {
            const result = await pool.request()
                .input('userId', Int, id)
                .query(sqlQueries.getUserViaUserID);
            return result.recordset[0];
        } catch (error) {
            return (error.message);
        }

    } catch (error) {
        return error.message;
    }
}

const deleteUserData = async (id) => {
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

        //check if user DOES NOT exist
        const existingUser = await pool.request()
            .input('id', Int, id)
            .query(sqlQueries.checkUserExistanceViaUserID);

        if (existingUser.recordset.length === 0 ) {
            return "User Does Not Exist";
        }

        try {
            await pool.request()
                .input('id', Int, id)
                .query(sqlQueries.deleteUser);

            return ("User Deleted Successfully !!!");
        } catch (error) {
            return (error.message);
        }
    } catch (error) {
        return error.message;
    }

}

export {
    registerUsersData,
    loginUsersData,
    forgotPasswordData,
    resetPasswordData,
    getUserProfileData,
    updatePasswordData,
    getAllUsersData,
    getUserData,
    deleteUserData
}