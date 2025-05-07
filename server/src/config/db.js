const mysql = require('mysql2');
require('dotenv').config();

// Use connection pooling
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export pool for use in app.js
module.exports = pool;