import sqlite3 from "sqlite3";
import log from "./logger";

// Open the SQLite database

// Create the products table if it doesn't exist

function dropTable() {
  const db = new sqlite3.Database("sqlite3.db");
  const query = `DROP TABLE IF EXISTS historico`;
  db.run(query, (err) => {
    if (err) {
      log.error("Error dropping table:", err);
    } else {
      log.info("Table dropped successfully");
    }
  });
}

function createTable() {
  const db = new sqlite3.Database("sqlite3.db");

  const query = `CREATE TABLE IF NOT EXISTS historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price REAL,
        title TEXT,
        loja TEXT,
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  db.run(query, (err) => {
    if (err) {
      log.error("Error creating table:", err);
    } else {
      log.info("Table created successfully");
    }
  });
  db.close();
}

// Define a function to insert price and title into the database
function insertData(price: number, title: string, loja: string, url: string) {
  const db = new sqlite3.Database("sqlite3.db");
  const query = `INSERT INTO historico (price, title, loja, url) VALUES (?, ?, ?, ?)`;
  db.run(query, [price, title, loja, url], (err) => {
    if (err) {
      log.error("Error inserting data:", err);
    } else {
      log.info("Data inserted successfully");
    }
  });
  db.close();
}

export default { createTable, insertData, dropTable };
