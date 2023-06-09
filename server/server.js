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
    return (data = await connection.query(query));
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.end();
  }
};

app.get("/show-ideas", async (req, res) => {
  const data = await queryDatabase(
    `SELECT title, description, id FROM brilliant_minds.ideas ORDER BY id DESC`
  );
  res.send(data);
});

app.get("/show-idea", async (req, res) => {
  const data = await queryDatabase(
    `SELECT title, description FROM brilliant_minds.ideas WHERE id=${req.query.id}`
  );
  res.send(data);
});

const checkInput = (req, res, next) => {
  let { title, description } = req.body;
  if (title == "" || description == "") {
    res.json({ err: "All fields are required!" });
  } else {
    next();
  }
};

app.post("/new-idea", checkInput, async (req, res) => {
  let { title, description } = req.body;
  const data = await queryDatabase(
    `CALL brilliant_minds.insert_idea('${title}', '${description}');`
    /* CREATE PROCEDURE brilliant_minds.insert_idea(IN title VARCHAR(255), IN description TEXT)
    BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
      BEGIN
              SELECT CONCAT(title, ' and/or ', description, ' is not valid');
      END;
    SET @sql = CONCAT('INSERT INTO brilliant_minds.ideas (title, description) VALUES (\'',title,'\', \'',description,'\')');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    END */
  );
  res.json({ affectedRows: data.affectedRows });
});

app.post("/update-idea", checkInput, async (req, res) => {
  let { title, description, id } = req.body;
  const data = await queryDatabase(
    `CALL brilliant_minds.update_idea('${title}', '${description}', ${id});`
    /* CREATE PROCEDURE brilliant_minds.update_idea(IN title VARCHAR(255), IN description TEXT, IN id SMALLINT(6))
    BEGIN
      DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                    SELECT CONCAT(title, ' and/or ', description, ' is not valid');
            END;

      SET @sql = CONCAT('UPDATE brilliant_minds.ideas SET title=\'',title,'\', description=\'',description,'\' WHERE id=',id);

      PREPARE stmt FROM @sql;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
    END */
  );
  res.json({ affectedRows: data.affectedRows });
});

app.post("/delete-idea", async (req, res) => {
  let { id } = req.body;
  const data = await queryDatabase(
    `DELETE FROM brilliant_minds.ideas WHERE id = ${id};`
  );
  res.json({ affectedRows: data.affectedRows });
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
