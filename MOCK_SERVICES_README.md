# Store Wizard Mock Backend Services

This directory contains mock backend services that simulate the real backend endpoints for the Store Wizard application. These services are designed to work with the existing API structure and provide realistic responses for development and testing.

## Services Overview

### 1. LLM Service (Port 9021)
**Purpose**: AI-powered content and product generation
- **Endpoints**:
  - `POST /generate-products` - Generate products based on categories
  - `POST /generate-content` - Generate AI content for various purposes
  - `POST /optimize-seo` - Optimize content for SEO
  - `GET /health` - Health check

### 2. Integration Service (Port 9024)
**Purpose**: E-commerce platform integrations and store deployment
- **Endpoints**:
  - `GET /platforms` - Get available e-commerce platforms
  - `GET /integrations/{platform_id}` - Get integrations for a platform
  - `POST /deploy-store` - Deploy store to selected platform
  - `GET /deployment-status/{deployment_id}` - Check deployment status
  - `POST /send-notifications` - Send launch notifications
  - `POST /setup-payment` - Setup payment integration
  - `POST /setup-shipping` - Setup shipping integration
  - `GET /health` - Health check

### 3. Content Service (Port 9022)
**Purpose**: Content generation and optimization
- **Endpoints**:
  - `POST /generate` - Generate AI content
  - `POST /optimize-seo` - Optimize content for SEO
  - `POST /generate-bulk` - Generate multiple content pieces
  - `GET /templates/{content_type}` - Get content templates
  - `POST /validate-content` - Validate generated content
  - `GET /health` - Health check

### 4. Theme Service (Port 9023)
**Purpose**: Theme management and customization
- **Endpoints**:
  - `GET /recommendations` - Get theme recommendations
  - `GET /themes/{theme_id}` - Get detailed theme information
  - `POST /customize` - Customize theme with user preferences
  - `POST /preview` - Generate theme preview
  - `GET /categories` - Get theme categories
  - `GET /trending` - Get trending themes
  - `GET /health` - Health check

### 5. Analytics Service (Port 9025)
**Purpose**: Store analytics and insights
- **Endpoints**:
  - `GET /predictions` - Get performance predictions
  - `GET /insights/{session_id}` - Get store insights
  - `GET /metrics/{store_id}` - Get detailed store metrics
  - `GET /reports/{store_id}` - Generate analytics reports
  - `GET /competitors/{store_id}` - Get competitor analysis
  - `GET /health` - Health check

## Quick Start

### 1. Start All Services
```bash
# From the store-wizard directory
docker-compose up -d
```

### 2. Test Services
```bash
# Run the test script to verify all services are working
python test_mock_services.py
```

### 3. Access Individual Services
- **LLM Service**: http://localhost:9021
- **Integration Service**: http://localhost:9024
- **Content Service**: http://localhost:9022
- **Theme Service**: http://localhost:9023
- **Analytics Service**: http://localhost:9025
- **Main API Service**: http://localhost:9020

## API Documentation

Each service provides automatic API documentation via FastAPI:

- **LLM Service Docs**: http://localhost:9021/docs
- **Integration Service Docs**: http://localhost:9024/docs
- **Content Service Docs**: http://localhost:9022/docs
- **Theme Service Docs**: http://localhost:9023/docs
- **Analytics Service Docs**: http://localhost:9025/docs

## Example Usage

### Generate Products
```bash
curl -X POST "http://localhost:9021/generate-products" \
  -H "Content-Type: application/json" \
  -d '{"categories": ["electronics", "fashion"], "count": 5}'
```

### Get Theme Recommendations
```bash
curl -X GET "http://localhost:9023/recommendations?industry=fashion&style=modern"
```

### Generate Content
```bash
curl -X POST "http://localhost:9022/generate" \
  -H "Content-Type: application/json" \
  -d '{"content_type": "product_description", "inputs": {"product_name": "Smartphone", "category": "Electronics"}}'
```

### Get Analytics Predictions
```bash
curl -X GET "http://localhost:9025/predictions?store_id=store_123"
```

## Mock Data Features

### Realistic Responses
All services generate realistic, varied responses using:
- Random data generation within realistic ranges
- UUID-based IDs for consistency
- Proper HTTP status codes and error handling
- Structured JSON responses matching expected schemas

### Dynamic Content
- Product generation creates varied products with realistic attributes
- Content generation adapts to input parameters
- Analytics provide different insights based on store IDs
- Theme recommendations filter based on industry and style preferences

### Error Simulation
Services include proper error handling and can simulate:
- Network timeouts
- Invalid requests
- Service unavailability
- Validation errors

## Development

### Adding New Endpoints
1. Add the endpoint to the appropriate service file
2. Update the test script to include the new endpoint
3. Update this README with the new endpoint documentation

### Modifying Mock Data
Each service uses random data generation. To modify the data:
1. Update the data generation logic in the service file
2. Adjust the ranges and options as needed
3. Test with the provided test script

### Service Dependencies
The services are designed to be independent but can communicate:
- Main API service forwards requests to other services
- Services can simulate network failures and timeouts
- Health checks ensure service availability

## Troubleshooting

### Service Not Starting
1. Check if ports are already in use
2. Verify Docker is running
3. Check service logs: `docker-compose logs [service-name]`

### Test Failures
1. Ensure all services are running: `docker-compose ps`
2. Check service health: `curl http://localhost:[port]/health`
3. Verify network connectivity between services

### API Errors
1. Check the service documentation at `/docs` endpoint
2. Verify request format matches expected schema
3. Check service logs for detailed error messages

## Integration with Frontend

The mock services are designed to work seamlessly with the existing frontend:
- All endpoints match the expected API structure
- Response formats are consistent with the frontend expectations
- CORS is properly configured for frontend integration
- Error responses follow the expected format

## Performance

Mock services are optimized for development:
- Fast response times (< 100ms typically)
- Minimal resource usage
- No external dependencies
- Suitable for local development and testing

## Security

For development purposes, these services:
- Accept all requests without authentication
- Don't validate API keys or tokens
- Should not be used in production environments
- Are designed for local development only 