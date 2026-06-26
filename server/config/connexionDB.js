

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  //connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false,},
});

pool
  .connect()
  .then(() =>
    console.log("Connexion à la base de données réussie !"),
  )
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;
