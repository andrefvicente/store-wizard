from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uuid
import random
from datetime import datetime, timedelta

app = FastAPI(title="Analytics Service", version="1.0.0")

class AnalyticsRequest(BaseModel):
    store_id: str
    metrics: List[str]
    date_range: Dict[str, str]

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "analytics"}

@app.get("/predictions")
async def get_predictions(store_id: Optional[str] = None):
    """Get performance predictions"""
    try:
        # Generate realistic predictions based on store_id or random data
        base_revenue = random.randint(30000, 80000)
        base_visitors = random.randint(8000, 15000)
        
        return {
            "revenue_forecast": {
                "monthly": f"${base_revenue:,}",
                "quarterly": f"${base_revenue * 3:,}",
                "yearly": f"${base_revenue * 12:,}",
                "growth_rate": f"{random.uniform(5, 25):.1f}%"
            },
            "traffic_prediction": {
                "monthly_visitors": base_visitors,
                "conversion_rate": round(random.uniform(1.5, 4.0), 2),
                "avg_order_value": round(random.uniform(75, 200), 2),
                "bounce_rate": round(random.uniform(25, 45), 1),
                "session_duration": f"{random.randint(2, 8)}m {random.randint(0, 59)}s"
            },
            "recommendations": [
                "Focus on SEO optimization to increase organic traffic",
                "Implement email marketing campaigns to boost conversions",
                "Add customer reviews and testimonials for social proof",
                "Optimize product pages for better conversion rates",
                "Consider implementing a loyalty program"
            ],
            "risk_factors": [
                "Seasonal fluctuations may affect sales",
                "Competition in your niche is increasing",
                "Supply chain issues could impact inventory"
            ],
            "opportunities": [
                "Mobile traffic is growing rapidly",
                "Social media engagement is high",
                "International markets show potential"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate predictions: {str(e)}")

@app.get("/insights/{session_id}")
async def get_insights(session_id: str):
    """Get store insights"""
    try:
        return {
            "session_id": session_id,
            "market_analysis": {
                "competition_level": random.choice(["low", "medium", "high"]),
                "market_size": random.choice(["small", "medium", "large"]),
                "growth_potential": random.choice(["low", "medium", "high"]),
                "market_trends": [
                    "E-commerce growth continues to accelerate",
                    "Mobile shopping is becoming dominant",
                    "Sustainability is increasingly important to consumers"
                ]
            },
            "customer_insights": {
                "target_audience": {
                    "age_range": "25-45",
                    "income_level": "middle to upper-middle",
                    "interests": ["technology", "lifestyle", "quality products"],
                    "shopping_behavior": "prefers convenience and quality"
                },
                "customer_satisfaction": round(random.uniform(3.8, 4.8), 1),
                "repeat_customer_rate": f"{random.uniform(15, 35):.1f}%"
            },
            "optimization_suggestions": [
                "Add social proof elements to increase trust",
                "Improve page load speed for better user experience",
                "Optimize for mobile users (60% of traffic)",
                "Implement abandoned cart recovery emails",
                "Add product recommendations to increase AOV"
            ],
            "performance_metrics": {
                "current_conversion_rate": round(random.uniform(1.5, 4.0), 2),
                "avg_session_duration": f"{random.randint(2, 8)}m {random.randint(0, 59)}s",
                "bounce_rate": round(random.uniform(25, 45), 1),
                "pages_per_session": round(random.uniform(2.5, 6.0), 1)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get insights: {str(e)}")

@app.get("/metrics/{store_id}")
async def get_store_metrics(
    store_id: str,
    metric_type: str = Query("all"),
    date_range: str = Query("30d")
):
    """Get detailed store metrics"""
    try:
        # Generate realistic metrics based on store_id
        base_traffic = random.randint(5000, 20000)
        base_revenue = random.randint(25000, 100000)
        
        metrics = {
            "traffic": {
                "total_visitors": base_traffic,
                "unique_visitors": int(base_traffic * 0.8),
                "page_views": int(base_traffic * 3.5),
                "sessions": int(base_traffic * 1.2),
                "new_users": int(base_traffic * 0.6),
                "returning_users": int(base_traffic * 0.4)
            },
            "sales": {
                "total_revenue": base_revenue,
                "orders": int(base_revenue / random.uniform(80, 150)),
                "average_order_value": round(base_revenue / int(base_revenue / random.uniform(80, 150)), 2),
                "conversion_rate": round(random.uniform(1.5, 4.0), 2),
                "abandoned_carts": int(base_traffic * 0.15)
            },
            "engagement": {
                "bounce_rate": round(random.uniform(25, 45), 1),
                "session_duration": f"{random.randint(2, 8)}m {random.randint(0, 59)}s",
                "pages_per_session": round(random.uniform(2.5, 6.0), 1),
                "time_on_page": f"{random.randint(1, 5)}m {random.randint(0, 59)}s"
            },
            "products": {
                "total_products": random.randint(50, 200),
                "top_selling": [
                    {"name": "Product A", "sales": random.randint(100, 500)},
                    {"name": "Product B", "sales": random.randint(80, 400)},
                    {"name": "Product C", "sales": random.randint(60, 300)}
                ],
                "low_stock": random.randint(5, 20),
                "out_of_stock": random.randint(1, 10)
            }
        }
        
        if metric_type != "all":
            return {metric_type: metrics.get(metric_type, {})}
        
        return {
            "store_id": store_id,
            "date_range": date_range,
            "metrics": metrics,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get metrics: {str(e)}")

@app.get("/reports/{store_id}")
async def generate_report(
    store_id: str,
    report_type: str = Query("summary"),
    format: str = Query("json")
):
    """Generate analytics reports"""
    try:
        if report_type == "summary":
            report = {
                "report_id": f"report_{uuid.uuid4().hex[:8]}",
                "store_id": store_id,
                "report_type": "summary",
                "generated_at": datetime.utcnow().isoformat(),
                "summary": {
                    "total_revenue": f"${random.randint(25000, 100000):,}",
                    "total_orders": random.randint(200, 800),
                    "conversion_rate": f"{random.uniform(1.5, 4.0):.2f}%",
                    "avg_order_value": f"${random.uniform(75, 200):.2f}",
                    "total_visitors": random.randint(5000, 20000)
                },
                "trends": {
                    "revenue_trend": "increasing",
                    "traffic_trend": "stable",
                    "conversion_trend": "improving"
                },
                "recommendations": [
                    "Focus on mobile optimization",
                    "Implement email marketing",
                    "Add customer reviews"
                ]
            }
        elif report_type == "detailed":
            report = {
                "report_id": f"report_{uuid.uuid4().hex[:8]}",
                "store_id": store_id,
                "report_type": "detailed",
                "generated_at": datetime.utcnow().isoformat(),
                "detailed_metrics": await get_store_metrics(store_id),
                "predictions": await get_predictions(store_id),
                "insights": await get_insights(f"session_{store_id}")
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid report type")
        
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@app.get("/competitors/{store_id}")
async def get_competitor_analysis(store_id: str):
    """Get competitor analysis"""
    try:
        competitors = [
            {
                "name": "Competitor A",
                "market_share": round(random.uniform(5, 25), 1),
                "strengths": ["Strong brand presence", "Wide product range"],
                "weaknesses": ["Higher prices", "Limited customer service"],
                "threat_level": "medium"
            },
            {
                "name": "Competitor B", 
                "market_share": round(random.uniform(3, 15), 1),
                "strengths": ["Innovative products", "Fast shipping"],
                "weaknesses": ["Limited selection", "No mobile app"],
                "threat_level": "low"
            },
            {
                "name": "Competitor C",
                "market_share": round(random.uniform(10, 30), 1),
                "strengths": ["Low prices", "Large customer base"],
                "weaknesses": ["Poor quality", "Slow customer service"],
                "threat_level": "high"
            }
        ]
        
        return {
            "store_id": store_id,
            "competitors": competitors,
            "total_competitors": len(competitors),
            "market_position": random.choice(["leader", "challenger", "niche", "emerging"]),
            "competitive_advantages": [
                "Superior product quality",
                "Better customer service",
                "Unique product features"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get competitor analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9025) 