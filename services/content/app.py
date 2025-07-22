from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid
import random

app = FastAPI(title="Content Service", version="1.0.0")

class ContentRequest(BaseModel):
    content_type: str
    inputs: Dict[str, Any]
    options: Dict[str, Any] = {}

class SEOOptimizationRequest(BaseModel):
    content: str
    target_keywords: List[str]
    content_type: str = "product"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "content"}

@app.post("/generate")
async def generate_content(request: ContentRequest):
    """Generate AI content"""
    try:
        content_type = request.content_type.lower()
        inputs = request.inputs
        
        # Generate different types of content based on content_type
        if content_type == "product_description":
            product_name = inputs.get("product_name", "Product")
            category = inputs.get("category", "General")
            content = f"Discover the amazing {product_name}. This premium {category.lower()} product offers exceptional quality and innovative features that will exceed your expectations. Perfect for modern lifestyles, it combines style with functionality."
        
        elif content_type == "store_description":
            business_name = inputs.get("business_name", "Our Store")
            industry = inputs.get("industry", "retail")
            content = f"Welcome to {business_name}, your premier destination for high-quality {industry} products. We're committed to providing exceptional customer service and the best products in the market."
        
        elif content_type == "meta_description":
            page_title = inputs.get("page_title", "Page")
            content = f"Explore {page_title} - Find the best products and services. Shop with confidence and enjoy fast shipping, secure payments, and excellent customer support."
        
        elif content_type == "blog_post":
            topic = inputs.get("topic", "E-commerce")
            content = f"# The Future of {topic}\n\nIn today's rapidly evolving digital landscape, {topic.lower()} continues to transform how businesses operate and serve their customers. This comprehensive guide explores the latest trends and strategies."
        
        elif content_type == "product_title":
            category = inputs.get("category", "Product")
            features = inputs.get("features", ["Quality", "Modern"])
            content = f"Premium {category} - {', '.join(features)}"
        
        elif content_type == "category_description":
            category = inputs.get("category", "Category")
            content = f"Explore our curated collection of {category.lower()} products. From premium selections to everyday essentials, we offer the best quality and value for your needs."
        
        else:
            content = f"Custom {content_type} content generated based on your requirements. This content is optimized for your specific needs and target audience."
        
        return {
            "content": content,
            "alternatives": [
                f"Alternative {content_type} content option 1",
                f"Alternative {content_type} content option 2",
                f"Alternative {content_type} content option 3"
            ],
            "quality_score": round(random.uniform(0.85, 0.98), 2),
            "seo_keywords": [
                inputs.get("primary_keyword", "keyword1"),
                inputs.get("secondary_keyword", "keyword2"),
                "quality",
                "premium",
                "best"
            ],
            "word_count": len(content.split()),
            "readability_score": round(random.uniform(60, 90), 1)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content generation failed: {str(e)}")

@app.post("/optimize-seo")
async def optimize_seo(request: SEOOptimizationRequest):
    """Optimize content for SEO"""
    try:
        content = request.content
        target_keywords = request.target_keywords
        
        # Simple keyword optimization simulation
        optimized_content = content
        keyword_density = {}
        
        for keyword in target_keywords:
            if keyword.lower() not in content.lower():
                optimized_content += f" {keyword}."
            keyword_density[keyword] = round(random.uniform(1.0, 3.0), 2)
        
        return {
            "optimized_content": optimized_content,
            "seo_score": round(random.uniform(70, 95), 1),
            "keyword_density": keyword_density,
            "suggestions": [
                "Add more relevant keywords",
                "Include internal links",
                "Optimize meta descriptions",
                "Improve heading structure",
                "Add alt text to images"
            ],
            "content_length": len(optimized_content),
            "readability_improvement": round(random.uniform(5, 15), 1)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SEO optimization failed: {str(e)}")

@app.post("/generate-bulk")
async def generate_bulk_content(requests: List[ContentRequest]):
    """Generate multiple content pieces in bulk"""
    try:
        results = []
        for request in requests:
            result = await generate_content(request)
            results.append({
                "request": request.dict(),
                "result": result
            })
        
        return {
            "results": results,
            "total_generated": len(results),
            "success_rate": len(results) / len(requests) if requests else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk content generation failed: {str(e)}")

@app.get("/templates/{content_type}")
async def get_content_templates(content_type: str):
    """Get content templates for a specific type"""
    templates = {
        "product_description": [
            {
                "id": "template_1",
                "name": "Feature-focused",
                "template": "Discover the amazing {product_name}. This premium product offers {feature_1}, {feature_2}, and {feature_3} that will exceed your expectations."
            },
            {
                "id": "template_2", 
                "name": "Benefit-focused",
                "template": "Transform your experience with {product_name}. Enjoy {benefit_1}, {benefit_2}, and {benefit_3} with this innovative solution."
            }
        ],
        "store_description": [
            {
                "id": "template_1",
                "name": "Professional",
                "template": "Welcome to {business_name}, your premier destination for high-quality {industry} products. We're committed to providing exceptional customer service."
            },
            {
                "id": "template_2",
                "name": "Casual",
                "template": "Hey there! Welcome to {business_name} where we bring you the best {industry} products with a smile and great service."
            }
        ],
        "meta_description": [
            {
                "id": "template_1",
                "name": "Standard",
                "template": "Explore {page_title} - Find the best products and services. Shop with confidence and enjoy fast shipping, secure payments."
            }
        ]
    }
    
    return {
        "content_type": content_type,
        "templates": templates.get(content_type, []),
        "total_templates": len(templates.get(content_type, []))
    }

@app.post("/validate-content")
async def validate_content(content: str, content_type: str):
    """Validate generated content"""
    try:
        # Simple content validation
        word_count = len(content.split())
        char_count = len(content)
        
        validation_results = {
            "is_valid": True,
            "word_count": word_count,
            "char_count": char_count,
            "issues": [],
            "suggestions": []
        }
        
        # Check minimum length
        if word_count < 10:
            validation_results["issues"].append("Content too short")
            validation_results["suggestions"].append("Add more descriptive content")
        
        # Check for common issues
        if content.count(".") < 2:
            validation_results["suggestions"].append("Add more sentences for better readability")
        
        if len(content) > 500:
            validation_results["suggestions"].append("Consider shortening content for better engagement")
        
        return validation_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content validation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9022) 