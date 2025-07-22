#!/usr/bin/env python3
"""
Test script to verify all mock backend services are working correctly.
Run this after starting all services with docker-compose up.
"""

import asyncio
import httpx
import json
from typing import Dict, Any

# Service configurations
SERVICES = {
    "llm": {"url": "http://localhost:9021", "name": "LLM Service"},
    "integration": {"url": "http://localhost:9024", "name": "Integration Service"},
    "content": {"url": "http://localhost:9022", "name": "Content Service"},
    "theme": {"url": "http://localhost:9023", "name": "Theme Service"},
    "analytics": {"url": "http://localhost:9025", "name": "Analytics Service"},
    "api": {"url": "http://localhost:9020", "name": "Main API Service"}
}

async def test_health_endpoint(client: httpx.AsyncClient, service_name: str, url: str) -> bool:
    """Test health endpoint for a service"""
    try:
        response = await client.get(f"{url}/health")
        if response.status_code == 200:
            print(f"✅ {service_name} health check passed")
            return True
        else:
            print(f"❌ {service_name} health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ {service_name} health check failed: {str(e)}")
        return False

async def test_llm_service(client: httpx.AsyncClient, url: str) -> bool:
    """Test LLM service endpoints"""
    try:
        # Test product generation
        response = await client.post(
            f"{url}/generate-products",
            json={"categories": ["electronics", "fashion"], "count": 3}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ LLM product generation: {len(data.get('products', []))} products generated")
        else:
            print(f"❌ LLM product generation failed: {response.status_code}")
            return False
        
        # Test content generation
        response = await client.post(
            f"{url}/generate-content",
            json={
                "content_type": "product_description",
                "inputs": {"product_name": "Test Product", "category": "Electronics"}
            }
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ LLM content generation: {data.get('word_count', 0)} words generated")
        else:
            print(f"❌ LLM content generation failed: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ LLM service test failed: {str(e)}")
        return False

async def test_integration_service(client: httpx.AsyncClient, url: str) -> bool:
    """Test Integration service endpoints"""
    try:
        # Test platforms endpoint
        response = await client.get(f"{url}/platforms")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Integration platforms: {len(data.get('platforms', []))} platforms available")
        else:
            print(f"❌ Integration platforms failed: {response.status_code}")
            return False
        
        # Test platform integrations
        response = await client.get(f"{url}/integrations/shopify")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Integration shopify: {len(data.get('integrations', []))} integrations available")
        else:
            print(f"❌ Integration shopify failed: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Integration service test failed: {str(e)}")
        return False

async def test_content_service(client: httpx.AsyncClient, url: str) -> bool:
    """Test Content service endpoints"""
    try:
        # Test content generation
        response = await client.post(
            f"{url}/generate",
            json={
                "content_type": "product_description",
                "inputs": {"product_name": "Test Product", "category": "Electronics"}
            }
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Content generation: {data.get('word_count', 0)} words generated")
        else:
            print(f"❌ Content generation failed: {response.status_code}")
            return False
        
        # Test SEO optimization
        response = await client.post(
            f"{url}/optimize-seo",
            json={
                "content": "This is a test product description.",
                "target_keywords": ["test", "product", "electronics"]
            }
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Content SEO optimization: score {data.get('seo_score', 0)}")
        else:
            print(f"❌ Content SEO optimization failed: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Content service test failed: {str(e)}")
        return False

async def test_theme_service(client: httpx.AsyncClient, url: str) -> bool:
    """Test Theme service endpoints"""
    try:
        # Test theme recommendations
        response = await client.get(f"{url}/recommendations")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Theme recommendations: {len(data.get('themes', []))} themes available")
        else:
            print(f"❌ Theme recommendations failed: {response.status_code}")
            return False
        
        # Test theme details
        response = await client.get(f"{url}/themes/theme_001")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Theme details: {data.get('name', 'Unknown')} theme loaded")
        else:
            print(f"❌ Theme details failed: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Theme service test failed: {str(e)}")
        return False

async def test_analytics_service(client: httpx.AsyncClient, url: str) -> bool:
    """Test Analytics service endpoints"""
    try:
        # Test predictions
        response = await client.get(f"{url}/predictions")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Analytics predictions: {data.get('revenue_forecast', {}).get('monthly', 'N/A')} monthly revenue")
        else:
            print(f"❌ Analytics predictions failed: {response.status_code}")
            return False
        
        # Test insights
        response = await client.get(f"{url}/insights/test_session")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Analytics insights: {data.get('market_analysis', {}).get('competition_level', 'N/A')} competition level")
        else:
            print(f"❌ Analytics insights failed: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Analytics service test failed: {str(e)}")
        return False

async def test_api_service(client: httpx.AsyncClient, url: str) -> bool:
    """Test Main API service endpoints"""
    try:
        # Test wizard session creation
        response = await client.post(
            f"{url}/wizard/session",
            json={"user_preferences": {}}
        )
        if response.status_code == 200:
            data = response.json()
            session_id = data.get('session_id')
            print(f"✅ API wizard session created: {session_id}")
        else:
            print(f"❌ API wizard session failed: {response.status_code}")
            return False
        
        # Test theme recommendations
        response = await client.get(f"{url}/themes/recommendations")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API theme recommendations: {len(data.get('themes', []))} themes")
        else:
            print(f"❌ API theme recommendations failed: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ API service test failed: {str(e)}")
        return False

async def main():
    """Main test function"""
    print("🚀 Testing Store Wizard Mock Backend Services")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        results = {}
        
        # Test health endpoints
        print("\n📋 Health Check Tests:")
        for service, config in SERVICES.items():
            results[f"{service}_health"] = await test_health_endpoint(
                client, config["name"], config["url"]
            )
        
        # Test specific service endpoints
        print("\n🔧 Service Functionality Tests:")
        
        # LLM Service
        print("\n🤖 LLM Service:")
        results["llm_functional"] = await test_llm_service(client, SERVICES["llm"]["url"])
        
        # Integration Service
        print("\n🔗 Integration Service:")
        results["integration_functional"] = await test_integration_service(client, SERVICES["integration"]["url"])
        
        # Content Service
        print("\n📝 Content Service:")
        results["content_functional"] = await test_content_service(client, SERVICES["content"]["url"])
        
        # Theme Service
        print("\n🎨 Theme Service:")
        results["theme_functional"] = await test_theme_service(client, SERVICES["theme"]["url"])
        
        # Analytics Service
        print("\n📊 Analytics Service:")
        results["analytics_functional"] = await test_analytics_service(client, SERVICES["analytics"]["url"])
        
        # Main API Service
        print("\n🌐 Main API Service:")
        results["api_functional"] = await test_api_service(client, SERVICES["api"]["url"])
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 Test Summary:")
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {test_name}: {status}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Mock backend services are working correctly.")
        else:
            print("⚠️  Some tests failed. Check the service logs for more details.")

if __name__ == "__main__":
    asyncio.run(main()) 