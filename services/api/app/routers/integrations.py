from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import httpx

router = APIRouter()

class IntegrationConfig(BaseModel):
    integration_type: str
    provider: str
    configuration: Dict[str, Any]

@router.post("/setup")
async def setup_integration(config: IntegrationConfig):
    """Setup third-party integration"""
    return {
        "status": "configured",
        "integration_id": "int_123456",
        "provider": config.provider,
        "message": f"{config.provider} integration configured successfully"
    }

@router.get("/status/{integration_id}")
async def get_integration_status(integration_id: str):
    """Get integration status"""
    return {
        "integration_id": integration_id,
        "status": "connected",
        "last_sync": "2024-01-01T12:00:00Z",
        "health": "healthy"
    }

@router.get("/platforms")
async def get_available_platforms():
    """Get available e-commerce platforms"""
    try:
        # Forward request to integration service
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://integration:9024/platforms",
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="Integration service error")
                
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Integration service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get platforms: {str(e)}")

@router.get("/integrations/{platform_id}")
async def get_platform_integrations(platform_id: str):
    """Get available integrations for a platform"""
    try:
        # Forward request to integration service
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"http://integration:9024/integrations/{platform_id}",
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="Integration service error")
                
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Integration service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get integrations: {str(e)}") 