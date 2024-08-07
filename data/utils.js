'use strict';
//import * as fs from 'fs-extra';
// import { readdir } from 'fs-extra';
// const fs = require('fs-extra');
import pkg from 'fs-extra';
const {readdir, readFileSync} = pkg;
import {join} from 'path';

const loadSqlQueries = async (folderName) => {
    const filePath = join(process.cwd(), 'data', folderName);
    const files = await readdir(filePath);
    const sqlFiles = await files.filter(f => f.endsWith('.sql'));
    const queries = {};

    for (const sqlFile of sqlFiles) {
        const query = await readFileSync(join(filePath, sqlFile), {encoding: "utf-8"});
        queries[sqlFile.replace(".sql", "")] = query
    }
    return queries;
}

export {
    loadSqlQueries
}