from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uuid
import random

app = FastAPI(title="Theme Service", version="1.0.0")

class ThemeCustomizationRequest(BaseModel):
    theme_id: str
    customizations: Dict[str, Any]

class ThemePreviewRequest(BaseModel):
    theme_id: str
    customizations: Dict[str, Any] = {}
    preview_type: str = "desktop"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "theme"}

@app.get("/recommendations")
async def get_theme_recommendations(
    industry: Optional[str] = Query(None),
    style: Optional[str] = Query(None)
):
    """Get theme recommendations"""
    themes = [
        {
            "id": "theme_001",
            "name": "Modern Minimal",
            "description": "Clean and minimalist design perfect for modern businesses",
            "preview_url": "https://demo.com/preview/modern-minimal",
            "score": 0.95,
            "features": ["Responsive", "Fast Loading", "SEO Optimized", "Mobile First"],
            "customization_options": {
                "colors": True, 
                "layout": True, 
                "fonts": True,
                "images": True
            },
            "industry_suitability": ["technology", "fashion", "lifestyle"],
            "style_tags": ["minimal", "modern", "clean"]
        },
        {
            "id": "theme_002", 
            "name": "Elegant Fashion",
            "description": "Sophisticated design ideal for fashion and luxury brands",
            "preview_url": "https://demo.com/preview/elegant-fashion",
            "score": 0.88,
            "features": ["Image Gallery", "Product Zoom", "Mobile Friendly", "Social Integration"],
            "customization_options": {
                "colors": True, 
                "fonts": True,
                "layout": False,
                "images": True
            },
            "industry_suitability": ["fashion", "luxury", "beauty"],
            "style_tags": ["elegant", "luxury", "fashion"]
        },
        {
            "id": "theme_003",
            "name": "Bold Commerce",
            "description": "High-converting design focused on sales and conversions",
            "preview_url": "https://demo.com/preview/bold-commerce",
            "score": 0.92,
            "features": ["Conversion Optimized", "Trust Badges", "Reviews Display", "Quick Buy"],
            "customization_options": {
                "colors": True,
                "layout": True,
                "fonts": True,
                "images": True
            },
            "industry_suitability": ["electronics", "home", "sports"],
            "style_tags": ["bold", "commercial", "conversion"]
        },
        {
            "id": "theme_004",
            "name": "Artisan Craft",
            "description": "Handcrafted feel perfect for artisanal and handmade products",
            "preview_url": "https://demo.com/preview/artisan-craft",
            "score": 0.87,
            "features": ["Storytelling", "Product Stories", "Artisan Profiles", "Handmade Badges"],
            "customization_options": {
                "colors": True,
                "fonts": True,
                "layout": False,
                "images": True
            },
            "industry_suitability": ["handmade", "artisan", "craft"],
            "style_tags": ["artisan", "handmade", "craft"]
        }
    ]
    
    # Filter by industry if provided
    if industry:
        themes = [t for t in themes if industry.lower() in [i.lower() for i in t.get("industry_suitability", [])]]
    
    # Filter by style if provided
    if style:
        themes = [t for t in themes if style.lower() in [s.lower() for s in t.get("style_tags", [])]]
    
    return {
        "themes": themes,
        "total": len(themes),
        "filters_applied": {
            "industry": industry,
            "style": style
        }
    }

@app.get("/themes/{theme_id}")
async def get_theme_details(theme_id: str):
    """Get detailed theme information"""
    themes = {
        "theme_001": {
            "id": "theme_001",
            "name": "Modern Minimal",
            "description": "Clean and minimalist design perfect for modern businesses",
            "preview_url": "https://demo.com/preview/modern-minimal",
            "demo_url": "https://demo.com/demo/modern-minimal",
            "features": ["Responsive", "Fast Loading", "SEO Optimized", "Mobile First"],
            "customization_options": {
                "colors": {
                    "primary": "#007bff",
                    "secondary": "#6c757d",
                    "accent": "#28a745",
                    "background": "#ffffff",
                    "text": "#212529"
                },
                "fonts": {
                    "heading": "Inter",
                    "body": "Inter",
                    "accent": "Inter"
                },
                "layout": {
                    "header_style": "minimal",
                    "footer_style": "simple",
                    "product_grid": "3-column"
                }
            },
            "screenshots": [
                "https://demo.com/screenshots/modern-minimal-home.jpg",
                "https://demo.com/screenshots/modern-minimal-product.jpg",
                "https://demo.com/screenshots/modern-minimal-cart.jpg"
            ],
            "performance_metrics": {
                "load_time": "1.2s",
                "lighthouse_score": 95,
                "mobile_score": 92
            }
        }
    }
    
    if theme_id not in themes:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    return themes[theme_id]

@app.post("/customize")
async def customize_theme(request: ThemeCustomizationRequest):
    """Customize theme with user preferences"""
    try:
        theme_id = request.theme_id
        customizations = request.customizations
        
        # Simulate theme customization
        customization_result = {
            "theme_id": theme_id,
            "customization_id": f"custom_{uuid.uuid4().hex[:8]}",
            "preview_url": f"https://demo.com/preview/{theme_id}/custom_{uuid.uuid4().hex[:8]}",
            "applied_changes": customizations,
            "compatibility_score": round(random.uniform(0.85, 1.0), 2),
            "estimated_load_time": round(random.uniform(1.0, 2.5), 1),
            "message": "Theme customization applied successfully"
        }
        
        return customization_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Theme customization failed: {str(e)}")

@app.post("/preview")
async def generate_theme_preview(request: ThemePreviewRequest):
    """Generate theme preview with customizations"""
    try:
        theme_id = request.theme_id
        customizations = request.customizations
        preview_type = request.preview_type
        
        # Generate preview URLs for different devices
        preview_urls = {
            "desktop": f"https://demo.com/preview/{theme_id}/desktop?customizations={uuid.uuid4().hex[:8]}",
            "tablet": f"https://demo.com/preview/{theme_id}/tablet?customizations={uuid.uuid4().hex[:8]}",
            "mobile": f"https://demo.com/preview/{theme_id}/mobile?customizations={uuid.uuid4().hex[:8]}"
        }
        
        return {
            "theme_id": theme_id,
            "preview_id": f"preview_{uuid.uuid4().hex[:8]}",
            "preview_urls": preview_urls,
            "current_preview": preview_urls.get(preview_type, preview_urls["desktop"]),
            "customizations_applied": customizations,
            "generated_at": "2024-01-01T12:00:00Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview generation failed: {str(e)}")

@app.get("/categories")
async def get_theme_categories():
    """Get available theme categories"""
    return {
        "categories": [
            {
                "id": "modern",
                "name": "Modern",
                "description": "Contemporary designs with clean lines and minimal aesthetics",
                "theme_count": 15
            },
            {
                "id": "classic",
                "name": "Classic",
                "description": "Timeless designs that never go out of style",
                "theme_count": 12
            },
            {
                "id": "bold",
                "name": "Bold",
                "description": "Eye-catching designs with vibrant colors and strong typography",
                "theme_count": 8
            },
            {
                "id": "elegant",
                "name": "Elegant",
                "description": "Sophisticated designs perfect for luxury and premium brands",
                "theme_count": 10
            },
            {
                "id": "minimal",
                "name": "Minimal",
                "description": "Simple and clean designs focused on content and usability",
                "theme_count": 20
            }
        ],
        "total_categories": 5
    }

@app.get("/trending")
async def get_trending_themes():
    """Get currently trending themes"""
    return {
        "trending_themes": [
            {
                "id": "theme_001",
                "name": "Modern Minimal",
                "trend_score": 0.95,
                "usage_count": 1250,
                "rating": 4.8
            },
            {
                "id": "theme_002",
                "name": "Elegant Fashion",
                "trend_score": 0.88,
                "usage_count": 890,
                "rating": 4.6
            },
            {
                "id": "theme_003",
                "name": "Bold Commerce",
                "trend_score": 0.92,
                "usage_count": 1100,
                "rating": 4.7
            }
        ],
        "period": "last_30_days"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9023) 