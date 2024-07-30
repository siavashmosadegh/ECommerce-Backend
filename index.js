'use strict';

const express = require('express');
const config = require('./config');
const app = express();

app.listen(config.port,() => {
    console.log(`server is listening on PORT ${config.port} in ${config.nodeenv} mode`)
})