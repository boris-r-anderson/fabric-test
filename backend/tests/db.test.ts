import { fail } from 'assert'
import { initDatabase, connectDb } from '../src/db'
import { unlink } from 'fs'

const TEST_DB_PATH = './test-database.db'
const FAKE_RECORD = ['Title', '2005', 'fake_id', 'movie']

describe('Test Database', () => {
  beforeAll(() => {
    initDatabase(TEST_DB_PATH)
  })
  it('Should be able to add record to database', async () => {
    try {
      const test_db = connectDb(TEST_DB_PATH)
      test_db.run(
        'INSERT INTO records(title, year, imdbId, type) VALUES(?, ?, ?, ?)',
        FAKE_RECORD
      )
      test_db.close()
    } catch (error) {
      fail(`Encountered error: ${error}`)
    }
  })

  it('Can retrieve record from database', async () => {
    const test_db = connectDb(TEST_DB_PATH)
    const record = test_db.get('SELECT * FROM records where title = ?', [
      FAKE_RECORD[0],
    ])
    test_db.close()
    expect(record != undefined)
  })

  it('Can add a poster to record (assume ID 1)', async () => {
    try {
      const test_db = connectDb(TEST_DB_PATH)
      test_db.run('INSERT INTO posters(record_id, url) VALUES(?, ?)', [
        1,
        'poster.com',
      ])
      test_db.close()
    } catch (error) {
      fail(`Encountered error: ${error}`)
    }
  })

  afterAll(() => {
    const test_db = connectDb(TEST_DB_PATH)
    test_db.run('DELETE FROM records')

    // Not sure why this is necessary, but we get SQL errors if it's missing
    try {
      test_db.run('DELETE FROM posters')
    } catch (err) {}
    test_db.close()
  })
})
