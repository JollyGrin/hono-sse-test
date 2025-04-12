# Hono SSE Test Project

This project demonstrates a real-time event stream using Hono's Server-Sent Events (SSE) and a Next.js client.

## Project Structure

- `/server`: Hono server that provides an SSE endpoint with updates every second
- `/client`: Next.js application that consumes and displays the SSE events

## Running the Project

### 1. Start the Hono Server

```bash
cd server
bun install
bun dev  # Runs with hot-reloading
```

The server will be available at http://localhost:3001 with the following endpoints:
- `GET /`: Health check
- `GET /events`: SSE endpoint that sends an update every second

### 2. Start the Next.js Client

```bash
cd client
bun install
bun run dev
```

The client will be available at http://localhost:3000

## How It Works

1. The Hono server uses `@hono/streaming` to create an SSE endpoint
2. The server sends an update message every second with an incrementing counter
3. The Next.js client connects to the SSE endpoint using the EventSource API
4. Updates are displayed in real-time on the client with timestamps
