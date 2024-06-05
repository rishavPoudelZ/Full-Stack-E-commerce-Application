const Pool = require("pg").Pool;
//creating a pool that connects wwith the postgres dataBase
//fill out teh information according to what you have set in postGres SQL
const pool = new Pool({
    user: "postgres",
    password: "Password",
    host: "localhost",
    port: "5432",
    database: "ecommerce"
});

module.exports = pool;