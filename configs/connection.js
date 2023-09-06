//PostgreSQL
const pg = require('pg');
require('dotenv').config

const PostgreSQL = new pg.Client({
    user: process.env.USER_POSTGRE,
    password: process.env.PASSWORD_POSTGRE,
    database: process.env.DATABASE_POSTGRE,
    port: process.env.PORT_POSTGRE,
    host: process.env.HOST_POSTGRE,
    ssl: false
});
PostgreSQL.connect();

module.exports = {
  PostgreSQL
}