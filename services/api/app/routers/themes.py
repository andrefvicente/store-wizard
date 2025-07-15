from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/recommendations")
async def get_theme_recommendations(
    industry: Optional[str] = Query(None),
    style: Optional[str] = Query(None)
):
    """Get theme recommendations"""
    return {
        "themes": [
            {
                "id": "theme_001",
                "name": "Modern Minimal",
                "preview_url": "https://demo.com/preview/modern-minimal",
                "score": 0.95,
                "features": ["Responsive", "Fast Loading", "SEO Optimized"],
                "customization_options": {"colors": True, "layout": True}
            },
            {
                "id": "theme_002", 
                "name": "Elegant Fashion",
                "preview_url": "https://demo.com/preview/elegant-fashion",
                "score": 0.88,
                "features": ["Image Gallery", "Product Zoom", "Mobile Friendly"],
                "customization_options": {"colors": True, "fonts": True}
            }
        ],
        "total": 2,
        "page": 1
    } 