const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cR@yM06t3",
  database: "user_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/login", (req, res) => {
  const { username, name, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.send("Error occurred");
    }

    if (results.length > 0) {
      res.send("Error: Username already exists.");
    } else {
      const insertQuery =
        "INSERT INTO users (username, name, password) VALUES (?, ?, ?)";
      db.query(insertQuery, [username, name, password], (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.send("Error occurred");
        }

        res.render("success", { username, name, password });
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
