import os
from datetime import datetime, timezone

from fastapi import APIRouter

from ..redis.config import Redis

health = APIRouter()


def _integration_status() -> dict[str, str]:
    llm = "configured" if os.getenv("HUGGINFACE_INFERENCE_TOKEN") and os.getenv("MODEL_URL") else "not_configured"
    return {
        "llm_api": llm,
        "message_queue": "redis_streams",
        "worker_channel": "message_channel",
    }


@health.get("/health")
async def service_health():
    redis_status = "unconfigured"
    try:
        redis_client = Redis()
        connection = await redis_client.create_connection()
        await connection.ping()
        redis_status = "connected"
        await connection.close()
    except Exception:
        redis_status = "unavailable"

    overall = "ok" if redis_status == "connected" else "degraded"

    return {
        "status": overall,
        "service": "sentinel-api",
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dependencies": {
            "redis": redis_status,
        },
        "integrations": _integration_status(),
        "stack": {
            "api": "fastapi",
            "worker": "python_asyncio",
            "frontend": "react",
        },
    }
