// app.ts
import cors from 'cors'
import api from './api'
import { initDatabase } from './db'

const corsConfig: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
}

// Start Express server, init DB
api.use(cors(corsConfig))
const PORT = 8000
initDatabase()

api.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`)
})
