# Architecture

## Overview

Sentinel Console is a three-service full-stack system. Each layer can be developed, deployed, and troubleshot independently — the same pattern used for internal dashboards, automation pipelines, and integrated backends.

## Components

### Client (`client/`)

React + TypeScript **operations dashboard**:

- Session launcher and real-time chat UI
- **System status panel** — polls `/health` for API, Redis, and integration state
- WebSocket client for live messaging
- Configurable API base URL via `REACT_APP_API_URL` (Cloudflare Pages deploy)

### API Server (`server/`)

Python **FastAPI** application:

- REST endpoints for sessions and health checks
- WebSocket gateway for real-time chat
- Pushes inbound messages to Redis Streams (`message_channel`)
- Consumes worker responses from `response_channel` and forwards to clients
- Pydantic schemas for typed request/response models

### Worker (`worker/`)

Python **automation worker** (asyncio):

- Long-running process — listens on Redis Streams
- Persists messages to Redis JSON
- Calls external **LLM API** (Hugging Face Inference)
- Publishes bot responses back to the stream
- Decouples slow integration work from the HTTP/WebSocket layer

### Redis

| Feature | Use |
|---|---|
| Redis JSON | Session documents (token, user, message history) |
| Redis Streams | Message queue between API and worker |
| TTL | Sessions expire after 1 hour |

## Data flow

1. User opens dashboard → status panel confirms services are up
2. User starts session → `POST /token` → Redis JSON entry created
3. User sends chat message → WebSocket → API enqueues on `message_channel`
4. Worker dequeues → saves human message → calls LLM API → saves bot reply
5. Worker publishes to `response_channel` → API forwards to WebSocket → UI updates

## Troubleshooting across the stack

| Symptom | Likely cause |
|---|---|
| Status panel shows API offline | Server not running on port 3500 |
| Redis `unavailable` | Wrong `REDIS_*` env vars or Redis not reachable |
| Chat sends but no reply | Worker not running or missing HF token |
| WebSocket fails in production | `REACT_APP_WS_URL` not set to `wss://` API host |

## Health checks

`GET /health` returns service version, timestamp, Redis connectivity, and integration configuration status — suitable for monitoring dashboards and deploy smoke tests.
