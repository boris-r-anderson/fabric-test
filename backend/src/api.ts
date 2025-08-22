import express, { Request, Response } from 'express'
import { API_ENDPOINT_1, API_ENDPOINT_2, API_ENDPOINT_3 } from './variables'
import { RecordList } from './types'
import { addRecords } from './db'

const api = express()
api.use(express.json())

// Generic function for fetching data from endpoints
const fetchData = async (url: string): Promise<RecordList> => {
  try {
    const apiResponse = await fetch(url)
    if (!apiResponse.ok)
      throw new Error(
        `HTTP Error: unable to retrieve data from endpoint ${url}`
      )
    else return apiResponse.json()
  } catch (error) {
    console.error(
      'Unhandled exception occurred when fetching data from endpoint'
    )
    throw error
  }
}

// Fetches first set of API results and saves entries to the database
api.get('/api/button-1', async (request: Request, response: Response) => {
  try {
    const results = await fetchData(API_ENDPOINT_1)

    await addRecords(results.Search)

    response.json({ results: results.Search })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

api.get('/api/button-2', async (request: Request, response: Response) => {
  try {
    const results = await fetchData(API_ENDPOINT_2)

    await addRecords(results.Search)

    response.json({ results: results.Search })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

api.get('/api/button-3', async (request: Request, response: Response) => {
  try {
    const results = await fetchData(API_ENDPOINT_3)

    await addRecords(results.Search)

    response.json({ results: results.Search })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

export default api
