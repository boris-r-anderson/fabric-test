import request from 'supertest'
import api from '../src/api'

describe('Test API', () => {
  it('Button 1 should return array and status 200', async () => {
    const response = await request(api).get('/api/button-1')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.results)).toBe(true)
  })
  it('Button 2 should return array and status 200', async () => {
    const response = await request(api).get('/api/button-2')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.results)).toBe(true)
  })
  it('Button 3 should return array and status 200', async () => {
    const response = await request(api).get('/api/button-3')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.results)).toBe(true)
  })
})
