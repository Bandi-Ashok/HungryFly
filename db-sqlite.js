const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'hungryfly.db'));

function getConnection() {
  return db;
}

module.exports = { getConnection, sql: null };
