import asyncpg
import redis.asyncio as redis
from app.config import get_settings

_db_pool = None
_redis_client = None

async def get_database():
    global _db_pool
    if _db_pool is None:
        settings = get_settings()
        _db_pool = await asyncpg.create_pool(settings.DATABASE_URL)
    return _db_pool

async def get_redis_client():
    global _redis_client
    if _redis_client is None:
        settings = get_settings()
        _redis_client = redis.from_url(settings.REDIS_URL)
    return _redis_client 