from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Simple auth middleware - in production, implement proper JWT validation
        request.state.user_id = "demo-user"
        response = await call_next(request)
        return response 