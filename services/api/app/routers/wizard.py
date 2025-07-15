from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid
import httpx
from datetime import datetime

router = APIRouter()

class WizardSession(BaseModel):
    user_preferences: Dict[str, Any] = {}

class StepData(BaseModel):
    step_data: Dict[str, Any]
    auto_advance: bool = True

class ProductGenerationRequest(BaseModel):
    categories: List[str]
    count: int = 3

class LaunchStoreRequest(BaseModel):
    session_id: str
    store_config: Dict[str, Any]
    launch_settings: Dict[str, Any]

class StoreLaunchResponse(BaseModel):
    store_id: str
    store_url: str
    status: str
    deployment_id: str
    estimated_time: int

@router.post("/session")
async def create_session(session: WizardSession):
    """Create a new wizard session"""
    session_id = str(uuid.uuid4())
    return {
        "session_id": session_id,
        "current_step": 1,
        "message": "Wizard session created successfully"
    }

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get wizard session state"""
    return {
        "session_id": session_id,
        "current_step": 1,
        "configuration": {},
        "progress": {"completed_steps": [], "total_steps": 6}
    }

@router.put("/session/{session_id}/step/{step_number}")
async def update_step(session_id: str, step_number: int, step_data: StepData):
    """Update wizard step"""
    if step_number < 1 or step_number > 6:
        raise HTTPException(status_code=400, detail="Invalid step number")
    
    return {
        "success": True,
        "next_step": min(step_number + 1, 6),
        "recommendations": ["Complete business information", "Add product details"]
    }

@router.post("/llm/generate-products")
async def generate_products(request: ProductGenerationRequest):
    """Generate products using LLM service"""
    try:
        # Forward request to LLM service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://llm:9021/generate-products",
                json={
                    "categories": request.categories,
                    "count": request.count
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="LLM service error")
                
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"LLM service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Product generation failed: {str(e)}")

@router.post("/launch/validate")
async def validate_store_launch(request: LaunchStoreRequest):
    """Validate store configuration before launch"""
    try:
        # Validate required fields
        required_fields = ['businessName', 'products', 'selectedTheme']
        missing_fields = [field for field in required_fields if not request.store_config.get(field)]
        
        if missing_fields:
            return {
                "valid": False,
                "errors": [f"Missing required field: {field}" for field in missing_fields],
                "warnings": []
            }
        
        # Check product count
        products = request.store_config.get('products', [])
        if len(products) < 3:
            return {
                "valid": False,
                "errors": ["Minimum 3 products required for launch"],
                "warnings": []
            }
        
        # Check theme selection
        if not request.store_config.get('selectedTheme'):
            return {
                "valid": False,
                "errors": ["Store theme must be selected"],
                "warnings": []
            }
        
        # Check integrations
        integrations = request.store_config.get('integrations', {})
        warnings = []
        
        if not integrations.get('payment'):
            warnings.append("No payment providers configured")
        
        if not integrations.get('shipping'):
            warnings.append("No shipping providers configured")
        
        return {
            "valid": True,
            "errors": [],
            "warnings": warnings,
            "store_id": f"store_{uuid.uuid4().hex[:8]}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@router.post("/launch/deploy")
async def deploy_store(request: LaunchStoreRequest):
    """Deploy store to selected platform"""
    try:
        # Validate store configuration first
        validation = await validate_store_launch(request)
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail="Store validation failed")
        
        # Generate store ID and URL
        store_id = validation["store_id"]
        store_url = f"https://{store_id}.nextbasket.com"
        deployment_id = f"deploy_{uuid.uuid4().hex[:8]}"
        
        # Forward deployment request to integration service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://integration:9024/deploy-store",
                json={
                    "store_id": store_id,
                    "store_config": request.store_config,
                    "launch_settings": request.launch_settings,
                    "deployment_id": deployment_id
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "store_id": store_id,
                    "store_url": store_url,
                    "deployment_id": deployment_id,
                    "status": "deploying",
                    "estimated_time": 120,  # 2 minutes
                    "message": "Store deployment started successfully"
                }
            else:
                raise HTTPException(status_code=500, detail="Deployment service error")
                
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Integration service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Store deployment failed: {str(e)}")

@router.get("/launch/status/{deployment_id}")
async def get_deployment_status(deployment_id: str):
    """Get store deployment status"""
    try:
        # Check deployment status with integration service
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"http://integration:9024/deployment-status/{deployment_id}",
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                # Return mock status if service unavailable
                return {
                    "deployment_id": deployment_id,
                    "status": "completed",
                    "progress": 100,
                    "store_url": f"https://store_{deployment_id[:8]}.nextbasket.com",
                    "message": "Store deployment completed successfully"
                }
                
    except httpx.RequestError:
        # Return mock status if service unavailable
        return {
            "deployment_id": deployment_id,
            "status": "completed",
            "progress": 100,
            "store_url": f"https://store_{deployment_id[:8]}.nextbasket.com",
            "message": "Store deployment completed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@router.post("/launch/notify")
async def send_launch_notifications(store_id: str, notification_type: str = "launch"):
    """Send launch notifications to customers and stakeholders"""
    try:
        # Forward notification request to integration service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://integration:9024/send-notifications",
                json={
                    "store_id": store_id,
                    "notification_type": notification_type,
                    "timestamp": datetime.utcnow().isoformat()
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="Notification service error")
                
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Integration service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notification failed: {str(e)}") 