'use strict';

import {loadSqlQueries} from '../utils.js';
//import {sqlconfig} from '../../config.js';
import pkg from 'mssql';
import pkg2 from 'bcryptjs';
import pkg3 from 'jsonwebtoken';
const {
    connect,
    sql,
    NVarChar,
    DateTime,
    Int,
    Request,
    DateTimeOffset,
    VarChar
} = pkg;
const {hash, compare, compareSync} = pkg2;
const {sign} = pkg3;
import { v4 as uuidv4 } from 'uuid';
import sendResetEmail from '../../middlewares/email.js';
import axios from 'axios';

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

const updateUserData = async (id, updates) => {
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

        // Dynamically construct the SQL query 

        let updateFields = [];
        let sqlParams = [];
        let paramIndex = 1;

        console.log(updates);

        for (const [key, value] of Object.entries(updates)) {
            updateFields.push(`${key} = @param${paramIndex}`);
            sqlParams.push({ name: `param${paramIndex}`, value});
            paramIndex++;
        }

        console.log(updateFields.join(", "));
        console.log(sqlParams);

        if (updateFields.length === 0) {
            return "No Fields Provided For Update";
        }

        const updateQuery = `
            UPDATE Users
            SET ${updateFields.join(', ')}
            WHERE UserID = @id
        `;

        const request = new Request();
        request.input('id', Int, id);
        sqlParams.forEach((param) => {
            request.input(param.name, param.value);
        });

        try {
            await request.query(updateQuery);

            return "User Updated Successfully"
        } catch( error) {
            return error.message;
        }

        
    } catch (error) {
        return error.message;
    }
}

const loginUsersWithPhoneData = async (phoneNumber) => {
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
            .input('phoneNumber', NVarChar(20), phoneNumber)
            .query(sqlQueries.checkUserExistanceViaPhoneNumber);

        if (existingUser.recordset.length === 0 ) {
            return "User Does Not Exist";
        }

        const userId = existingUser.recordset[0].UserID;

        const token = sign({ phone: phoneNumber, id: userId }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        return token;
    } catch (error) {
        return error.message;
    }
}

const loginRequestOTPData = async (phoneNumber) => {
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

        const existingUser = await pool.request()
            .input('phoneNumber', NVarChar(20), phoneNumber)
            .query(sqlQueries.checkUserExistanceViaPhoneNumber);

        if (existingUser.recordset.length === 0) {
            return {
                success: false,
                message: "User Does Not Exist"
            };
        }

        const userId = await existingUser.recordset[0].UserID;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

        await pool.request()
            .input("phoneNumber", NVarChar(20), phoneNumber)
            .input("otpCode", NVarChar(10), otp)
            .input("expiresAt", DateTimeOffset, expiresAt)
            .input("userId", Int, userId)
            .query(sqlQueries.insertIntoOTPs);

        const API_KEY = "1IC5R2XsGEAXjcqPVXJ8SMHLGyfDUYcizfmYsnjEFa2j9xBr";
        const PATTERN_CODE = 780121;

        const response = await axios.post(
            "https://api.sms.ir/v1/send/verify",
            {
                mobile: phoneNumber,
                templateId: PATTERN_CODE,
                parameters: [{
                name: "Code",
                value: otp
                }]
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-API-KEY": API_KEY
                }
            }
        );

        return {
            success: true,
            message: "OTP Sent",
        };

    } catch (error) {
        console.error("Error:", error.message);
        return {
            success: false,
            message: error.message || "Unknown error"
        };
    }
};

const loginVerifyOTPData = async (phoneNumber, otpCode) => {
    try {
        const pool = await connect({
            server: process.env.SQL_SERVER,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true,
            },
        });

        const sqlQueries = await loadSqlQueries("authentication");

        // ۱. پیدا کردن OTP معتبر و استفاده‌نشده و تاریخ معتبر
        const result = await pool.request()
            .input("phoneNumber", NVarChar(20), phoneNumber)
            .input("otpCode", NVarChar(10), otpCode)
            .query(sqlQueries.getOTP);

        if (result.recordset.length === 0) {
            return { success: false, message: "کد تأیید نامعتبر یا منقضی شده است" };
        }

        const otpRow = result.recordset[0];

        console.log("OTP Row: ", otpRow);

        // ۲. غیرفعال‌سازی OTP
        await pool.request()
            .input("otpId", Int, otpRow.otpId)
            .query(sqlQueries.invalidatingOTP);

        // ۳. پیدا کردن کاربر
        const userResult = await pool.request()
            .input("phoneNumber", NVarChar(20), phoneNumber)
            .query(sqlQueries.checkUserExistanceViaPhoneNumber);

        if (userResult.recordset.length === 0) {
            return { success: false, message: "کاربری با این شماره یافت نشد" };
        }

        const user = userResult.recordset[0];

        // ۴. تولید JWT
        const token = sign({ id: user.UserID , phone: user.phoneNumber, }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        return {
            success: true,
            token,
            user: {
                id: user.UserID,
                phoneNumber: user.PhoneNumber
            },
        };

    } catch (error) {
        console.error("verifyOTP error:", error);
        return {
            success: false,
            message: "خطای داخلی سرور"
        };
    }
};

const getUserByPhone = async ( mobile ) => {
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

        const existingUser = await pool.request()
            .input('phoneNumber', NVarChar(20), mobile)
            .query(sqlQueries.checkUserExistanceViaPhoneNumber);

        if (existingUser.recordset.length === 0) {
            return null
        }

        return existingUser.recordset[0];

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }
}

const getGuestByPhone = async ( mobile ) => {
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

        const existingGuestUser = await pool.request()
            .input('mobile', NVarChar(20), mobile)
            .query(sqlQueries.getGuestUserViaPhone);

        //console.log(existingGuestUser.recordset[0]);

        if (existingGuestUser.recordset.length === 0) {
            return null
        }

        return existingGuestUser.recordset[0];

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }

}

const createGuest = async ( mobile ) => {
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

        await pool.request()
            .input('mobile', NVarChar(20), mobile)
            .query(sqlQueries.createGuestUserViaPhone);

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }
}

const insertOtp = async ( mobile, ownerType, ownerRef ) => {
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

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

        // await pool.request()
        //     .input('mobile', NVarChar(20), mobile)
        //     .query(sqlQueries.createGuestUserViaPhone);

        await pool.request()
            .input("phoneNumber", NVarChar(20), mobile)
            .input("otpCode", NVarChar(10), otpCode)
            .input("expiresAt", DateTimeOffset, expiresAt)
            // .input("ownerType", NVarChar(1), ownerType)
            // .input("ownerRef", Int, ownerRef)
            .input("userId", Int, ownerType === "U" ? ownerRef : null)
            .input("guestId", Int, ownerType === "G" ? ownerRef : null )
            .query(sqlQueries.insertOtp);

        return otpCode;

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }    
}

const getOtpViaMobileAndOtp = async (mobile, otp) => {
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

        const result = await pool.request()
            .input('mobile', NVarChar(20), mobile)
            .input('otpCode', NVarChar(10), otp)
            .query(sqlQueries.getOtpViaMobileAndOtp);

        return result.recordset[0];

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }
}

const markOtpAsUsed = async (otpId) => {
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

        await pool.request()
            .input("otpId", Int, otpId)
            .query(sqlQueries.markOtpAsUsed)

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }    
}

const createUserViaPhone = async (mobile, firstName, lastName, passwordHash) => {
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

        const insert = await pool.request()
            .input("PhoneNumber", NVarChar(20), mobile)
            .input("FirstName", NVarChar(100), firstName)
            .input("LastName", NVarChar(100), lastName)
            .input("PasswordHash", Int, passwordHash)
            .input("RegistrationType", VarChar(50), 'initialPhone')
            .query(sqlQueries.createUserViaPhone);

        const value = { userId: insert.recordset[0].UserID};

        return value;

        // const insert = await pool.request()
        //     .input('UserID', Int, userID)
        //     .query(sqlQueries.insertIntoCartViaUserIdINITIALY);
        // const value = { cartId: insert.recordset[0].CartId, items: [] }
        // return value;
        
    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }
}

const insertRegisterDataAndGenerateOTP = async (mobile, firstName, lastName, hashedPassword) => {
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

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

        const result = await pool.request()
            .input("otpCode", NVarChar(10), otpCode)
            .input("PhoneNumber", NVarChar(20), mobile)
            .input("FirstName", NVarChar(100), firstName)
            .input("LastName", NVarChar(100), lastName)
            .input("PasswordHash", NVarChar(255), hashedPassword)
            .input("expiresAt", DateTimeOffset, expiresAt)
            .query(sqlQueries.insertIntoRegisterData);

        if (result.recordset.length === 0) {
            throw new Error ('Insert Failed');
        }

        return otpCode;

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }
}

const getOtpFromRegisterOTP = async (mobile, otp) => {
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

        const result = await pool.request()
            .input("otp", NVarChar(10), otp)
            .input("mobile", NVarChar(100), mobile)
            .query(sqlQueries.getOtpFromRegisterOtp);

        if (result.recordset.length === 0) {
            throw new Error ('No OTP for that Phone Number');
        }

        return result.recordset[0];

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }    
}

const markRegisterOtpAsUsed = async (RegisterOTPsId) => {
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

        await pool.request()
            .input("RegisterOTPsId", Int, RegisterOTPsId)
            .query(sqlQueries.markRegisterOtpAsUsed);

    } catch (error) {

        console.error("Error:", error.message);

        return {
            success: false,
            message: error.message || "Unknown error"
        };

    }
}

export {
    registerUsersData,
    loginUsersData,
    forgotPasswordData,
    resetPasswordData,
    updatePasswordData,
    getAllUsersData,
    getUserData,
    deleteUserData,
    updateUserData,
    loginUsersWithPhoneData,
    loginRequestOTPData,
    loginVerifyOTPData,
    getUserByPhone,
    getGuestByPhone,
    createGuest,
    insertOtp,
    getOtpViaMobileAndOtp,
    markOtpAsUsed,
    createUserViaPhone,
    insertRegisterDataAndGenerateOTP,
    getOtpFromRegisterOTP,
    markRegisterOtpAsUsed
}