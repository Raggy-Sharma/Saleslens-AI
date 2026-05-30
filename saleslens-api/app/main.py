import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import get_settings
from app.db.session import engine, Base
from app.routers import upload
from app.routers import dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup."""
    os.makedirs(get_settings().upload_dir, exist_ok=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="SalesLens AI",
    description="Sales analytics API with agentic AI insights",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}


# Router registration — add these AFTER you complete Section 11:
app.include_router(upload.router)
app.include_router(dashboard.router)
