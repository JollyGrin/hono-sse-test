# Hono SSE Server

A simple server using Hono and @hono/streaming to create a Server-Sent Events (SSE) endpoint that sends updates every second.

## Setup

```bash
# Install dependencies
bun install

# Run in development mode (with auto-reload)
bun dev

# Run in production mode
bun start
```

## Endpoints

- `GET /`: Health check endpoint
- `GET /events`: SSE endpoint that sends an update every second
