from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid
import random
from datetime import datetime, timedelta

app = FastAPI(title="Integration Service", version="1.0.0")

class DeployStoreRequest(BaseModel):
    store_id: str
    store_config: Dict[str, Any]
    launch_settings: Dict[str, Any]
    deployment_id: str

class NotificationRequest(BaseModel):
    store_id: str
    notification_type: str
    timestamp: str

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "integration"}

@app.get("/platforms")
async def get_available_platforms():
    """Get available e-commerce platforms"""
    return {
        "platforms": [
            {
                "id": "shopify",
                "name": "Shopify",
                "description": "Leading e-commerce platform for online stores",
                "features": ["Easy setup", "Mobile optimized", "Payment processing", "Inventory management"],
                "pricing": {"starter": 29, "professional": 79, "enterprise": 299},
                "rating": 4.8,
                "setup_time": "1-2 hours"
            },
            {
                "id": "woocommerce",
                "name": "WooCommerce",
                "description": "WordPress e-commerce plugin for customizable stores",
                "features": ["WordPress integration", "Highly customizable", "SEO friendly", "Free core"],
                "pricing": {"free": 0, "premium": 99, "enterprise": 299},
                "rating": 4.6,
                "setup_time": "2-4 hours"
            },
            {
                "id": "bigcommerce",
                "name": "BigCommerce",
                "description": "Enterprise e-commerce platform with advanced features",
                "features": ["Multi-channel selling", "Advanced analytics", "B2B capabilities", "API-first"],
                "pricing": {"standard": 39, "plus": 105, "pro": 399},
                "rating": 4.7,
                "setup_time": "3-5 hours"
            },
            {
                "id": "magento",
                "name": "Magento",
                "description": "Open-source e-commerce platform for large businesses",
                "features": ["Scalable", "Multi-store", "Advanced features", "Enterprise ready"],
                "pricing": {"community": 0, "commerce": 2000, "enterprise": 5000},
                "rating": 4.5,
                "setup_time": "1-2 weeks"
            }
        ],
        "total": 4
    }

@app.get("/integrations/{platform_id}")
async def get_platform_integrations(platform_id: str):
    """Get available integrations for a platform"""
    integrations = {
        "shopify": [
            {
                "id": "stripe",
                "name": "Stripe",
                "type": "payment",
                "description": "Online payment processing",
                "setup_difficulty": "easy",
                "features": ["Credit cards", "Digital wallets", "International payments"]
            },
            {
                "id": "mailchimp",
                "name": "Mailchimp",
                "type": "marketing",
                "description": "Email marketing automation",
                "setup_difficulty": "easy",
                "features": ["Email campaigns", "Automation", "Analytics"]
            },
            {
                "id": "klaviyo",
                "name": "Klaviyo",
                "type": "marketing",
                "description": "Customer data platform",
                "setup_difficulty": "medium",
                "features": ["Email marketing", "SMS", "Customer segmentation"]
            }
        ],
        "woocommerce": [
            {
                "id": "paypal",
                "name": "PayPal",
                "type": "payment",
                "description": "Digital payment platform",
                "setup_difficulty": "easy",
                "features": ["PayPal checkout", "Credit cards", "Buy now pay later"]
            },
            {
                "id": "google_analytics",
                "name": "Google Analytics",
                "type": "analytics",
                "description": "Web analytics service",
                "setup_difficulty": "medium",
                "features": ["Traffic analysis", "Conversion tracking", "E-commerce tracking"]
            }
        ],
        "bigcommerce": [
            {
                "id": "square",
                "name": "Square",
                "type": "payment",
                "description": "Payment and point-of-sale system",
                "setup_difficulty": "easy",
                "features": ["In-person payments", "Online payments", "Inventory management"]
            },
            {
                "id": "hubspot",
                "name": "HubSpot",
                "type": "crm",
                "description": "Customer relationship management",
                "setup_difficulty": "medium",
                "features": ["Lead management", "Email marketing", "Analytics"]
            }
        ],
        "magento": [
            {
                "id": "authorize_net",
                "name": "Authorize.net",
                "type": "payment",
                "description": "Payment gateway service",
                "setup_difficulty": "hard",
                "features": ["Credit card processing", "Fraud detection", "Recurring billing"]
            },
            {
                "id": "salesforce",
                "name": "Salesforce",
                "type": "crm",
                "description": "Customer relationship management",
                "setup_difficulty": "hard",
                "features": ["Lead management", "Sales automation", "Analytics"]
            }
        ]
    }
    
    if platform_id not in integrations:
        raise HTTPException(status_code=404, detail="Platform not found")
    
    return {
        "platform_id": platform_id,
        "integrations": integrations[platform_id],
        "total": len(integrations[platform_id])
    }

@app.post("/deploy-store")
async def deploy_store(request: DeployStoreRequest):
    """Deploy store to selected platform"""
    try:
        # Simulate deployment process
        deployment_status = random.choice(["deploying", "configuring", "testing"])
        
        return {
            "deployment_id": request.deployment_id,
            "store_id": request.store_id,
            "status": deployment_status,
            "progress": random.randint(10, 50),
            "estimated_completion": (datetime.utcnow() + timedelta(minutes=random.randint(5, 15))).isoformat(),
            "platform": request.store_config.get("platform", "shopify"),
            "message": f"Store deployment {deployment_status} successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")

@app.get("/deployment-status/{deployment_id}")
async def get_deployment_status(deployment_id: str):
    """Get store deployment status"""
    try:
        # Simulate different deployment stages
        stages = ["deploying", "configuring", "testing", "finalizing", "completed"]
        current_stage = random.choice(stages)
        
        if current_stage == "completed":
            progress = 100
            store_url = f"https://store_{deployment_id[:8]}.nextbasket.com"
            message = "Store deployment completed successfully"
        else:
            progress = random.randint(20, 90)
            store_url = None
            message = f"Store deployment {current_stage}"
        
        return {
            "deployment_id": deployment_id,
            "status": current_stage,
            "progress": progress,
            "store_url": store_url,
            "message": message,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@app.post("/send-notifications")
async def send_notifications(request: NotificationRequest):
    """Send launch notifications"""
    try:
        notification_types = {
            "launch": {
                "subject": "Your store is now live!",
                "message": f"Congratulations! Your store {request.store_id} has been successfully launched.",
                "recipients": ["customer", "stakeholders"]
            },
            "setup_complete": {
                "subject": "Store setup completed",
                "message": f"Your store {request.store_id} setup has been completed successfully.",
                "recipients": ["customer"]
            },
            "deployment_started": {
                "subject": "Store deployment started",
                "message": f"Deployment for store {request.store_id} has begun.",
                "recipients": ["customer"]
            }
        }
        
        notification = notification_types.get(request.notification_type, {
            "subject": "Store notification",
            "message": f"Notification for store {request.store_id}",
            "recipients": ["customer"]
        })
        
        return {
            "notification_id": f"notif_{uuid.uuid4().hex[:8]}",
            "store_id": request.store_id,
            "type": request.notification_type,
            "status": "sent",
            "recipients_count": len(notification["recipients"]),
            "sent_at": datetime.utcnow().isoformat(),
            "message": "Notifications sent successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notification failed: {str(e)}")

@app.post("/setup-payment")
async def setup_payment(platform_id: str, provider: str, config: Dict[str, Any]):
    """Setup payment integration"""
    try:
        return {
            "integration_id": f"pay_{uuid.uuid4().hex[:8]}",
            "platform_id": platform_id,
            "provider": provider,
            "status": "configured",
            "test_mode": config.get("test_mode", True),
            "message": f"{provider} payment integration configured successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment setup failed: {str(e)}")

@app.post("/setup-shipping")
async def setup_shipping(platform_id: str, provider: str, config: Dict[str, Any]):
    """Setup shipping integration"""
    try:
        return {
            "integration_id": f"ship_{uuid.uuid4().hex[:8]}",
            "platform_id": platform_id,
            "provider": provider,
            "status": "configured",
            "shipping_zones": config.get("shipping_zones", ["US", "CA"]),
            "message": f"{provider} shipping integration configured successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Shipping setup failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9024) 