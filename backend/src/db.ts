// const { Sequelize, DataTypes } = require('sequelize');
import sqlite3 from 'sqlite3'
import connectDb from './db_init.js'
import { RecordList, RecordResult } from './types.js'

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
