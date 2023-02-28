const mariadb = require("mariadb");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT;

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: 5,
});

app.use(express.json());
app.use(cors());

const queryDatabase = async (query) => {
  let connection;
  let data;
  try {
    connection = await pool.getConnection();
    data = await connection.query(query);
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.end();
    return data;
  }
};

app.get("/show-ideas", async (req, res) => {
  const data = await queryDatabase(`SELECT * FROM brilliant_minds.ideas`);
  res.send(data);
});

app.post("/new-idea", async (req, res) => {
  let { title, description } = req.body;
  await queryDatabase(
    `INSERT INTO brilliant_minds.ideas (title, description) VALUES ('${title}', '${description}')`
  );
  res.end;
});

app.post("/delete-idea", (req, res) => {
  // database connection
  // execute query
  // send response with data
});

app.use((request, response, next) => {
  console.log("No matching route found!");
  next();
});

app.get("*", (request, response) =>
  response.status(404).send({ error: `Not found` })
);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
