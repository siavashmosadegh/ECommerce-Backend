'use strict'
// const dotenv = require('dotenv');
// const assert = require('assert');
import dotenv from 'dotenv';
import assert from 'assert';
dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    NODE_ENV,
    SQL_USER,
    SQL_PASSWORD,
    SQL_DATABASE,
    SQL_SERVER
} = process.env;

const sqlEncrypt = process.env.ENCRYPT === "true";

assert(PORT, 'Port is required');
assert(HOST, 'HOST is required');

const sqlconfig = () => {
    return {
        server: SQL_SERVER,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        options: {
            encrypt: sqlEncrypt,
            enableArithAbort: true
        }
    }
}

export {
    PORT as port,
    HOST as host,
    HOST_URL as url,
    NODE_ENV as nodeenv,
    sqlconfig as sqlconfig
    // sql: {
    //     server: SQL_SERVER,
    //     database: SQL_DATABASE,
    //     user: SQL_USER,
    //     password: SQL_PASSWORD,
    //     options: {
    //         encrypt: sqlEncrypt,
    //         enableArithAbort: true
    //     }
    // }
}

// export default host;