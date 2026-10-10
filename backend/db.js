const mysql = require('mysql2');
const config = require('./config');

// A "pool" is just a group of database connections that we can reuse.
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  dateStrings: true, // send DATE columns back as "YYYY-MM-DD" text, not a shifted JS Date
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function that runs a SQL query and returns the result (rows).
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Function that tests the connection when the server starts.
function testConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        console.log('MySQL connected successfully -> database: ' + config.database);
        connection.release();
        resolve();
      }
    });
  });
}

module.exports = { pool, query, testConnection };