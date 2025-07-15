from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()

class ContentRequest(BaseModel):
    content_type: str
    inputs: Dict[str, Any]
    options: Dict[str, Any] = {}

@router.post("/generate")
async def generate_content(request: ContentRequest):
    """Generate AI content"""
    return {
        "content": f"Demo {request.content_type} content generated",
        "alternatives": ["Alternative 1", "Alternative 2"],
        "quality_score": 0.92,
        "seo_keywords": ["keyword1", "keyword2"]
    } 