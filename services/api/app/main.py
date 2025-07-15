"""
Store Launch Wizard API Service
Main FastAPI application entry point
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import Dict, Any

import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import get_settings
from app.middleware.auth import AuthMiddleware
from app.middleware.rate_limiting import RateLimitMiddleware
from app.middleware.logging import LoggingMiddleware
from app.routers import wizard, content, themes, integrations, analytics
from app.dependencies import get_database, get_redis_client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Store Launch Wizard API Service")
    
    # Initialize database connection
    try:
        db = await get_database()
        await db.execute("SELECT 1")  # Test connection
        logger.info("Database connection established")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise
    
    # Initialize Redis connection
    try:
        redis = await get_redis_client()
        await redis.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Store Launch Wizard API Service")


# Initialize FastAPI app
app = FastAPI(
    title="Store Launch Wizard API",
    description="AI-assisted e-commerce store setup wizard",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Get settings
settings = get_settings()

# Add middleware (order matters!)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=settings.ALLOWED_HOSTS
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuthMiddleware)

# Initialize Prometheus metrics
instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "request_id": getattr(request.state, "request_id", None)
        }
    )


@app.get("/healthz", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    checks = {}
    
    try:
        # Database health check
        db = await get_database()
        await db.execute("SELECT 1")
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"
    
    try:
        # Redis health check
        redis = await get_redis_client()
        await redis.ping()
        checks["redis"] = "healthy"
    except Exception as e:
        checks["redis"] = f"unhealthy: {str(e)}"
    
    # Overall health status
    is_healthy = all("healthy" in status for status in checks.values())
    
    return JSONResponse(
        content={
            "status": "healthy" if is_healthy else "unhealthy",
            "checks": checks,
            "version": "1.0.0"
        },
        status_code=200 if is_healthy else 503
    )


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "service": "Store Launch Wizard API",
        "version": "1.0.0",
        "description": "AI-assisted e-commerce store setup wizard",
        "docs": "/docs",
        "health": "/healthz"
    }


# Include routers
app.include_router(
    wizard.router,
    prefix="/api/v1/wizard",
    tags=["Wizard"]
)

app.include_router(
    content.router,
    prefix="/api/v1/content",
    tags=["Content Generation"]
)

app.include_router(
    themes.router,
    prefix="/api/v1/themes",
    tags=["Theme Recommendations"]
)

app.include_router(
    integrations.router,
    prefix="/api/v1/integrations",
    tags=["Integrations"]
)

app.include_router(
    analytics.router,
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 9020)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info"
    ) 