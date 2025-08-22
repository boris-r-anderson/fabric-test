// const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs')
import sqlite3 from 'sqlite3'
import { RecordResult } from './types.js'
import { DB_PATH } from './variables'

export const connectDb = (db_path: string = DB_PATH) => {
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
export const initDatabase = (db_path: string = DB_PATH) => {
  const db = connectDb(db_path)
  db.exec(`PRAGMA foreign_keys = ON;`) // enables foreign key constraints
  db.exec(
    `
  CREATE TABLE IF NOT EXISTS records (
    record_id INTEGER       PRIMARY KEY,
    title     VARCHAR(100)  NOT NULL,
    year      INTEGER       NOT NULL,
    imdbId    VARCHAR(50)   NOT NULL,
    type      VARCHAR(50)   NOT NULL
  );`,
    () => {
      db.exec(`
    CREATE TABLE IF NOT EXISTS posters (
      poster_id INTEGER       PRIMARY KEY,
      record_id INTEGER       NOT NULL,
      url       VARCHAR(200)  NOT NULL,
      FOREIGN KEY (record_id) REFERENCES records (record_id) ON DELETE CASCADE
    );`)
    }
  )
  console.log('DB initialised')
  db.close()
}

const dbGet = async (db: sqlite3.Database, sql: string, params: Array<any>) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, function (error, rows) {
      if (error) reject(error)
      else resolve(rows)
    })
  })

const dbRun = async (
  db: sqlite3.Database,
  sql: string,
  params: Array<any>,
  callback: Function | undefined = undefined
) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) reject(error)
      else if (callback != undefined) callback(this.lastID)
      resolve('')
    })
  })

// Insert movie/game posters via a callback function
const checkAndInsertPoster = async (
  db: sqlite3.Database,
  record_id: number,
  poster_url: string
) => {
  if (poster_url === 'N/A') return
  try {
    const poster = await dbGet(
      db,
      'SELECT poster_id FROM posters where url = ?',
      [poster_url]
    )

    if (!poster) {
      await dbRun(
        db,
        'INSERT INTO posters(record_id, url) VALUES(?, ?)',
        [record_id, poster_url],
        async (newPosterId: number) =>
          console.log(
            `Added poster for record ${record_id} with ID ${newPosterId}`
          )
      )
    }
  } catch (error) {
    console.error(`Unable to add poster record`)
    throw error
  }
}

export const addRecords = async (results: Array<RecordResult>) => {
  const db = connectDb()

  // Could be optimised with a transaction, but this is fine for low volumes of data
  results.forEach(async (record) => {
    // Check if the record already exists
    const queryRecord = await dbGet(
      db,
      'SELECT record_id FROM records WHERE title = ?',
      [record.Title]
    )

    // If not, add new record with poster entry (via callback)
    if (!queryRecord) {
      await dbRun(
        db,
        'INSERT INTO records(title, year, imdbId, type) VALUES(?, ?, ?, ?)',
        [record.Title, record.Year, record.imdbID, record.Type],
        async (newRecordId: number) => {
          console.log(`Added record ${record.Title} with ID ${newRecordId}`)
          await checkAndInsertPoster(db, newRecordId, record.Poster)
        }
      )
    }
  })

  // Done
  db.close()
}
