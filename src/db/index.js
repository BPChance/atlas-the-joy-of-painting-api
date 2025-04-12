// database connection
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'braden',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'joy_of_painting',
  password: process.env.DB_PASSWORD || 'braden',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
