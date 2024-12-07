"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const utils_1 = __importDefault(require("./utils"));
// Open the SQLite database
// Create the products table if it doesn't exist
function dropTable() {
    const db = new sqlite3_1.default.Database("sqlite3.db");
    const query = `DROP TABLE IF EXISTS historico`;
    db.run(query, (err) => {
        if (err) {
            utils_1.default.error("Error dropping table:", err);
        }
        else {
            utils_1.default.info("Table dropped successfully");
        }
    });
}
function createTable() {
    const db = new sqlite3_1.default.Database("sqlite3.db");
    const query = `CREATE TABLE IF NOT EXISTS historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price REAL,
        title TEXT,
        loja TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    db.run(query, (err) => {
        if (err) {
            utils_1.default.error("Error creating table:", err);
        }
        else {
            utils_1.default.info("Table created successfully");
        }
    });
    db.close();
}
// Define a function to insert price and title into the database
function insertData(price, title, loja) {
    const db = new sqlite3_1.default.Database("sqlite3.db");
    const query = `INSERT INTO historico (price, title, loja) VALUES (?, ?, ?)`;
    db.run(query, [price, title, loja], (err) => {
        if (err) {
            utils_1.default.error("Error inserting data:", err);
        }
        else {
            utils_1.default.info("Data inserted successfully");
        }
    });
    db.close();
}
exports.default = { createTable, insertData, dropTable };
