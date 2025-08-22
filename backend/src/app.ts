// app.ts
import express, { Request, Response } from 'express'
import { API_ENDPOINT_1, API_ENDPOINT_2, API_ENDPOINT_3 } from './variables'
import { RecordList } from './types'
import { addRecords } from './db'
import { initDatabase } from './db'
import cors from 'cors'

const corsConfig: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
}

// Start Express server, init DB
const app = express()
app.use(cors(corsConfig))
app.use(express.json())
const PORT = 8000
initDatabase()

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
app.get('/api/button-1', async (request: Request, response: Response) => {
  const results = await fetchData(API_ENDPOINT_1)

  await addRecords(results.Search)

  response.json({ results: results.Search })
})

app.get('/api/button-2', async (request: Request, response: Response) => {
  const results = await fetchData(API_ENDPOINT_2)

  await addRecords(results.Search)

  response.json({ results: results.Search })
})

app.get('/api/button-3', async (request: Request, response: Response) => {
  const results = await fetchData(API_ENDPOINT_3)

  await addRecords(results.Search)

  response.json({ results: results.Search })
})

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`)
})
