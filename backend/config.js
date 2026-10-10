const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vehicle_service',
};