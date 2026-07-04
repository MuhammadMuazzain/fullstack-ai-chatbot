# Deploying to Cloudflare Pages

This guide covers hosting the React dashboard on **Cloudflare Pages** while running the Python API and worker on a separate host.

## Frontend (Cloudflare Pages)

### Build settings

| Setting | Value |
|---|---|
| Root directory | `client` |
| Build command | `npm run build` |
| Build output | `build` |
| Node version | 18+ |

### Environment variables (Pages dashboard)

| Variable | Example |
|---|---|
| `REACT_APP_API_URL` | `https://api.yourdomain.com` |
| `REACT_APP_WS_URL` | `wss://api.yourdomain.com` |

These are read at build time by Create React App.

### Deploy via CLI (optional)

```bash
cd client
npm install
npm run build
npx wrangler pages deploy build --project-name=sentinel-console
```

Requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/) authenticated to your Cloudflare account.

## Backend (API + worker)

Cloudflare Pages serves **static files only**. The Python services deploy elsewhere:

- **FastAPI** — any VPS, Railway, Render, Fly.io, etc.
- **Worker** — same host or separate process manager (systemd, Docker, PM2 wrapper)

### CORS

Update `server/main.py` `origins` to include your Pages URL:

```python
origins = [
    "http://localhost:3000",
    "https://your-project.pages.dev",
]
```

### Environment variables (API host)

Copy from `server/.env.example` and `worker/.env.example`. At minimum:

- `REDIS_URL`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_USER`, `REDIS_PASSWORD`
- `HUGGINFACE_INFERENCE_TOKEN`, `MODEL_URL` (worker)
- `APP_VERSION`, `APP_ENV=production`

## DNS (optional)

Point a custom domain to Cloudflare Pages under **Pages → Custom domains**. API can live on a subdomain (`api.yourdomain.com`) with DNS proxied or DNS-only depending on your setup.

## Verify after deploy

1. Open Pages URL → status panel should show API `ok` (if API is reachable)
2. Start a session → confirm WebSocket connects (`wss://`)
3. Send a message → confirm worker returns a reply
