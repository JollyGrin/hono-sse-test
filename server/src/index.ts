import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

// Create a counter to track the number of updates
let counter = 0

// SSE endpoint that sends an update every second
app.get('/events', (c) => {
  // Set headers for SSE
  c.header('Content-Type', 'text/event-stream')
  c.header('Cache-Control', 'no-cache')
  c.header('Connection', 'keep-alive')

  // Create a readable stream using Web Streams API
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  
  // Function to send an SSE event
  const sendEvent = async () => {
    counter++
    const data = JSON.stringify({
      message: `Update #${counter}`,
      timestamp: new Date().toISOString()
    })

    const eventString = `id: ${counter}\nevent: update\ndata: ${data}\n\n`
    
    // Write to the stream
    await writer.write(new TextEncoder().encode(eventString))
    
    // Schedule the next update after 1 second
    setTimeout(sendEvent, 1000)
  }

  // Start sending events
  sendEvent()

  // Return the readable stream
  return c.body(readable)
})

// Simple health check endpoint
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Hono SSE server is running' })
})

console.log('Starting server on port 3001')
export default {
  port: 3001,
  fetch: app.fetch
}
