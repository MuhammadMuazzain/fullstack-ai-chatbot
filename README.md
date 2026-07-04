# Sentinel Console

**Author:** Muhammad Muazzain  
**Email:** muhammadmuazzain07@gmail.com  
**Repository:** [github.com/MuhammadMuazzain/fullstack-ai-chatbot](https://github.com/MuhammadMuazzain/fullstack-ai-chatbot)

Internal operations platform combining a **React dashboard**, **Python/FastAPI backend**, and **async automation worker** for real-time AI-assisted workflows. Built for teams that need integrated systems — session management, live messaging, API orchestration, and service health monitoring in one stack.

I designed and built this as a modular full-stack system: three independently deployable services connected through Redis queues, with the frontend deployable to **Cloudflare Pages** and the Python services on any cloud host.

---

## Why I built this

Most chat demos call an LLM directly from a single API route. That breaks down under load and makes automations hard to extend. This project demonstrates how I approach **production-style full-stack work**:

- **Python backend logic** separated from the UI
- **Background automations** via an async worker (integrations, inference, queue processing)
- **Dashboard-first UX** with live system status
- **API integrations** with external LLM providers
- **GitHub-based workflow** — feature branches, clean commits, documented deploy paths
- **Cloudflare-ready** static frontend with environment-based API configuration

---

## What it does

| Capability | Description |
|---|---|
| **Operations dashboard** | React UI with service health panel (API, Redis, LLM integration status) |
| **Real-time messaging** | WebSocket chat between dashboard and FastAPI server |
| **Session management** | Token-based sessions stored in Redis JSON with TTL |
| **Python automations** | Worker consumes Redis Streams, runs inference, publishes responses |
| **API integrations** | Hugging Face Inference API (GPT-J-6B) via authenticated HTTP |
| **Health monitoring** | `GET /health` for uptime checks and dependency status |
| **Multi-service architecture** | Client, API, and worker run independently and scale separately |

---

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, React Router, Axios |
| Dashboard | Custom status components, session context, WebSocket client |
| API | Python 3.10+, FastAPI, WebSockets, Uvicorn, Pydantic |
| Automations | Python asyncio worker, Redis Streams consumer |
| Data | Redis (JSON + Streams) |
| Integrations | Hugging Face Inference API |
| Deploy | Cloudflare Pages (client), cloud VM / container (API + worker) |
| Version control | GitHub — branches, PRs, single-commit release history |

---

## Architecture

```
┌─────────────────┐   HTTP / WS    ┌─────────────────┐
│  React Dashboard │ ◄────────────► │  FastAPI Server │
│  (Cloudflare)    │                │  (Python)       │
└─────────────────┘                └────────┬────────┘
                                          │
                                     Redis Streams
                                          │
                                 ┌────────▼────────┐
                                 │  Python Worker  │──► Hugging Face API
                                 │  (automations)  │
                                 └─────────────────┘
```

See [docs/architecture.md](docs/architecture.md) and [docs/deployment-cloudflare.md](docs/deployment-cloudflare.md).

---

## Project structure

```
fullstack-ai-chatbot/
├── client/          # React dashboard (deploy to Cloudflare Pages)
├── server/          # FastAPI API + WebSocket gateway
├── worker/          # Python automation / integration worker
└── docs/            # Architecture and deployment guides
```

---

## Quick start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Redis (local or managed — Redis Stack recommended for JSON support)

### 1. Environment

```bash
cp server/.env.example server/.env
cp worker/.env.example worker/.env
cp client/.env.example client/.env
```

Fill in Redis credentials and Hugging Face token (`HUGGINFACE_INFERENCE_TOKEN`, `MODEL_URL`).

### 2. API server (port 3500)

```bash
cd server
pip install -r requirements.txt
APP_ENV=development python main.py
```

### 3. Automation worker

```bash
cd worker
pip install -r requirements.txt
python main.py
```

### 4. Dashboard (port 3000)

```bash
cd client
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). The home screen shows live service status before you start a session.

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health, Redis status, integration checks |
| `POST` | `/token` | Create a new session |
| `GET` | `/refresh_token` | Restore session by token |
| `WS` | `/chat` | Real-time messaging channel |

---

## Deployment

### Frontend → Cloudflare Pages

The React app builds to static files. Deploy the `client/` folder:

```bash
cd client
npm run build
```

Connect the repo to Cloudflare Pages, set build command `npm run build`, output `build`, and add:

```
REACT_APP_API_URL=https://your-api.example.com
REACT_APP_WS_URL=wss://your-api.example.com
```

See [docs/deployment-cloudflare.md](docs/deployment-cloudflare.md).

### Backend → Cloudflare / cloud host

- **FastAPI + worker** run on a VPS, Railway, Render, or similar
- Set `REDIS_*` env vars and CORS origins to your Pages domain
- Worker must run continuously to process the message queue

---

## Development workflow

```bash
git checkout -b feature/my-change
# ... implement, test locally (all 3 services) ...
git commit -m "Add feature X"
git push -u origin feature/my-change
# Open pull request on GitHub → review → merge
```

Environment secrets live in `.env` files locally and in the host dashboard in production — never committed.

---

## Contact

**Muhammad Muazzain**  
muhammadmuazzain07@gmail.com  
[GitHub](https://github.com/MuhammadMuazzain)
