// const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs')
const db_path = './src/database.db'
import sqlite3 from 'sqlite3'
import { RecordList, RecordResult } from './types.js'

export const connectDb = () => {
  if (fs.existsSync(db_path)) {
    return new sqlite3.Database(db_path)
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
export const initDatabase = () => {
  const db = connectDb()
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
  console.log('DB initialised')
  db.close()
}

const queryDb = async (db: sqlite3.Database, sql: string, params: any) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, rows) => {
      if (error) reject(error)
      else resolve(rows)
    })
  })

export const addRecords = async (results: Array<RecordResult>) => {
  const db = connectDb()

  results.forEach(async (record) => {
    const queryRecord = await queryDb(
      db,
      'SELECT record_id FROM records WHERE title = ?',
      [record.Title]
    )
    console.log(queryRecord, record)
  })

  db.close()
}
