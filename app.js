const express = require("express");
const mysql = require("mysql");
const fs = require("fs");
const csv = require("csv-parser");

// Create a connection pool to manage database connections
const pool = mysql.createPool({
  host: "0.0.0.0",
  user: "soumya",
  password: "123456",
  database: "soumyaimdb3",
});

const app = express();

// Set the view engine and views directory for rendering templates
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());

// Import data from CSV file and insert into the database
app.get("/import", (req, res) => {
  const results = [];

  fs.createReadStream(__dirname + "/IMDb-movies.csv")
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      const insertQuery =
        "INSERT INTO movies (imdb_title_id, original_title, year, date_published, genre, duration, language, description, reviews_from_users, reviews_from_critics) VALUES ?";
      const values = results.map((row) => [
        row.imdb_title_id || null,
        row.original_title || null,
        row.year || null,
        row.date_published || null,
        row.genre || null,
        row.duration || null,
        row.language || null,
        row.description || null,
        row.reviews_from_users || null,
        row.reviews_from_critics || null,
      ]);

      // Get a connection from the pool
      pool.getConnection((error, connection) => {
        if (error) {
          console.error("Error getting database connection:", error);
          return res.status(500).send("Error getting database connection");
        }

        // Execute the insert query with the data
        connection.query(insertQuery, [values], (error, results) => {
          connection.release();

          if (error) {
            console.error("Error inserting data:", error);
            return res.status(500).send("Error inserting data");
          }

          console.log("Data imported successfully");
          res.send("Data imported successfully");
        });
      });
    });
});

// Create the movies table if it doesn't exist
pool.query(
  `CREATE TABLE IF NOT EXISTS movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    imdb_title_id VARCHAR(255),
    original_title VARCHAR(255),
    year INT,
    date_published VARCHAR(255),
    genre VARCHAR(255),
    duration INT,
    language VARCHAR(255),
    description TEXT,
    reviews_from_users INT,
    reviews_from_critics INT
  )`,
  (error, results) => {
    if (error) {
      console.error("Error creating movies table:", error);
      throw error;
    }
    console.log("Movies table created");
  }
);

// Retrieve movies by genre
app.get("/movies/by-genre", (req, res) => {
  const { genre } = req.query;
  const query = "SELECT * FROM movies WHERE genre LIKE ?";
  const params = [`%${genre}%`];

  pool.query(query, params, (error, results) => {
    if (error) {
      console.error("Error retrieving movies by genre:", error);
      return res.status(500).send("Error retrieving movies by genre");
    }
    res.json(results);
  });
});

// Retrieve movies by language
app.get("/movies/by-language", (req, res) => {
  const { lang } = req.query;
  const query = "SELECT * FROM movies WHERE language LIKE ?";
  const params = [`%${lang}%`];

  pool.query(query, params, (error, results) => {
    if (error) {
      console.error("Error retrieving movies by language:", error);
      return res.status(500).send("Error retrieving movies by language");
    }
    res.json(results);
  });
});

app.get("/", (req, res) => {
  const query = "SELECT * FROM movies";
  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving movies:", error);
      return res.status(500).send("Error retrieving movies");
    }
    res.render("index", { movies: results });
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
