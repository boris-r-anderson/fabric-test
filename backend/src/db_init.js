const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const db_path = './src/database.db'

function connectDb(arg = undefined) {
  if (fs.existsSync(db_path)) {
    return new sqlite3.Database(db_path, arg)
  } else {
    const db = new sqlite3.Database(db_path, (error) => {
      if (error) {
        return console.error(error.message)
      }
    })
    return db
  }
}

// Function to create tables - only called at startup and only if tables don't already exist
function createTables(db) {
  db.exec(`PRAGMA foreign_keys = ON;`) // enables foreign key constraints
  db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    record_id INTEGER       PRIMARY KEY,
    title     VARCHAR(100)  NOT NULL,
    year      INTEGER       NOT NULL,
    imdbId    VARCHAR(50)   NOT NULL,
    type      VARCHAR(50)   NOT NULL
  );`)
  db.exec(`
  CREATE TABLE IF NOT EXISTS posters (
    poster_id INTEGER       PRIMARY KEY,
    record_id INTEGER       NOT NULL,
    url       VARCHAR(200)  NOT NULL,
    FOREIGN KEY (record_id) REFERENCES records (record_id)
  );`)
}

// On initialisation, create tables and set foreign key constraint
const db = connectDb()
createTables(db)
db.close()

module.exports = connectDb
