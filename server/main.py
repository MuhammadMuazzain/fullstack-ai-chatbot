from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv
from src.routes.chat import chat
from src.routes.health import health
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

api = FastAPI(
    title="Sentinel Console API",
    description="FastAPI backend for operations dashboard, sessions, and real-time messaging",
    version=os.getenv("APP_VERSION", "1.0.0"),
)
api.include_router(chat)
api.include_router(health)

origins = ["http://localhost:3000"]
api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"],
)


if __name__ == "__main__":
    if os.environ.get("APP_ENV") == "development":
        uvicorn.run("main:api", host="0.0.0.0", port=3500, workers=4, reload=True)
