const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },
    console.log('Connected to Database'),
    console.log("\n-----------------------------------------\n")
)

module.exports = db;