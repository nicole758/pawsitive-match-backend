require('dotenv').config();
// Update with your config settings.

/**
 * @type { import("knex").Knex.Config }
 */
const config = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    database: process.env.DB_LOCAL_DBNAME,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
  },
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: config,
  production: config,
};