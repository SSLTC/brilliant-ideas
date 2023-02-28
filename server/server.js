import mariadb from "mariadb";
import * as dotenv from "dotenv";
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: 5,
});

(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const data = await connection.query(`SELECT * FROM brilliant_minds.ideas`);
    console.log(data);
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.end();
  }
})();

// the wrapper around the connection & try-catch-finally is just nameless arrow function to create an asynchronous environment.

server.get("/show-all", async (req, res) => {
  // database connection
  // execute query
  // send response with data
});

server.post("/create", async (req, res) => {
  // database connection
  // execute query
  // send response with data
});

server.post("/delete", async (req, res) => {
  // database connection
  // execute query
  // send response with data
});
