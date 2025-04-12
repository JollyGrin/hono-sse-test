# Next.js SSE Client

A Next.js application that connects to a Hono SSE server and displays real-time updates.

## Setup

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Features

- Real-time updates via Server-Sent Events (SSE)
- Connection status indicator
- Display of latest events with timestamps
- Automatic reconnection on connection failures
