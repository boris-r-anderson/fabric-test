// app.ts
import express, { Request, Response } from 'express'
import { API_ENDPOINT_1, API_ENDPOINT_2, API_ENDPOINT_3 } from './variables'

// Start Express server
const app = express()
app.use(express.json())
const PORT = 3000

const fetchData = async (url: string) => {
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
  response.json({ result: results })
})

app.get('/api/button-2', async (request: Request, response: Response) => {
  const results = await fetchData(API_ENDPOINT_2)
})

app.get('/api/button-3', async (request: Request, response: Response) => {
  const results = await fetchData(API_ENDPOINT_3)
})

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`)
})
