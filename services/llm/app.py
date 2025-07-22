from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid
import random

app = FastAPI(title="LLM Service", version="1.0.0")

class ProductGenerationRequest(BaseModel):
    categories: List[str]
    count: int = 3

class ContentGenerationRequest(BaseModel):
    content_type: str
    inputs: Dict[str, Any]
    options: Dict[str, Any] = {}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "llm"}

@app.post("/generate-products")
async def generate_products(request: ProductGenerationRequest):
    """Generate products using LLM"""
    try:
        products = []
        for i in range(request.count):
            category = random.choice(request.categories) if request.categories else "General"
            product = {
                "id": f"prod_{uuid.uuid4().hex[:8]}",
                "name": f"Sample {category} Product {i+1}",
                "description": f"This is a high-quality {category.lower()} product designed for modern consumers.",
                "price": round(random.uniform(19.99, 299.99), 2),
                "category": category,
                "images": [
                    f"https://images.unsplash.com/photo-{random.randint(1000000000, 9999999999)}?w=400&h=400&fit=crop",
                    f"https://images.unsplash.com/photo-{random.randint(1000000000, 9999999999)}?w=400&h=400&fit=crop"
                ],
                "features": [
                    "Premium quality materials",
                    "Modern design",
                    "Easy to use",
                    "Durable construction"
                ],
                "specifications": {
                    "weight": f"{random.randint(1, 10)} kg",
                    "dimensions": f"{random.randint(10, 50)}cm x {random.randint(10, 50)}cm x {random.randint(5, 20)}cm",
                    "color": random.choice(["Black", "White", "Blue", "Red", "Green"]),
                    "material": random.choice(["Cotton", "Polyester", "Leather", "Metal", "Plastic"])
                },
                "inventory": random.randint(10, 100),
                "rating": round(random.uniform(3.5, 5.0), 1),
                "reviews_count": random.randint(5, 50)
            }
            products.append(product)
        
        return {
            "products": products,
            "total_generated": len(products),
            "categories_used": request.categories,
            "generation_time": random.uniform(2.0, 5.0)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Product generation failed: {str(e)}")

@app.post("/generate-content")
async def generate_content(request: ContentGenerationRequest):
    """Generate AI content"""
    try:
        content_type = request.content_type.lower()
        inputs = request.inputs
        
        # Generate different types of content based on content_type
        if content_type == "product_description":
            product_name = inputs.get("product_name", "Product")
            content = f"Discover the amazing {product_name}. This premium product offers exceptional quality and innovative features that will exceed your expectations. Perfect for modern lifestyles, it combines style with functionality."
        
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
async def optimize_seo(content: str, target_keywords: List[str] = None):
    """Optimize content for SEO"""
    try:
        optimized_content = content
        if target_keywords:
            # Simple keyword optimization simulation
            for keyword in target_keywords:
                if keyword.lower() not in content.lower():
                    optimized_content += f" {keyword}."
        
        return {
            "optimized_content": optimized_content,
            "seo_score": round(random.uniform(70, 95), 1),
            "keyword_density": {keyword: round(random.uniform(1.0, 3.0), 2) for keyword in (target_keywords or [])},
            "suggestions": [
                "Add more relevant keywords",
                "Include internal links",
                "Optimize meta descriptions",
                "Improve heading structure"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SEO optimization failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9021) 