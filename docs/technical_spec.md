# Store Launch Wizard - Technical Specification

## Technology Stack

### Backend Services
- **Language**: Python 3.11+
- **Web Framework**: FastAPI 0.104+
- **Async Runtime**: asyncio with uvloop
- **HTTP Client**: httpx for async API calls
- **Validation**: Pydantic v2 for data validation
- **Authentication**: python-jose for JWT handling

### AI/ML Components
- **LLM Integration**: OpenAI SDK, Anthropic SDK
- **Local LLM**: Transformers library with Llama-3-8B
- **Vector Store**: Pinecone or Weaviate for embeddings
- **NLP Processing**: spaCy, NLTK for text analysis
- **Content Generation**: LangChain for prompt engineering

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand for wizard state
- **UI Components**: Tailwind CSS + Headless UI
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: TanStack Query for data fetching

### Databases
- **Primary**: PostgreSQL 16 with asyncpg driver
- **Cache**: Redis 7 with redis-py async client
- **Message Queue**: Redis Streams for background jobs
- **Vector Storage**: pgvector extension for embeddings

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose (dev), Kubernetes (prod)
- **Load Balancing**: NGINX or Traefik reverse proxy
- **Monitoring**: Prometheus + Grafana + Jaeger tracing

## Service Implementation Details

### API Service (store-wizard-api-service)

#### Core Dependencies
```python
fastapi==0.104.1
uvicorn[standard]==0.24.0
asyncpg==0.29.0
redis[hiredis]==5.0.1
pydantic==2.4.2
python-jose[cryptography]==3.3.0
httpx==0.25.0
python-multipart==0.0.6
```

#### Application Structure
```
services/api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py              # Environment configuration
│   ├── dependencies.py        # DI container setup
│   ├── middleware/            # Custom middleware
│   ├── models/               # Pydantic models
│   ├── routers/              # API route handlers
│   ├── services/             # Business logic layer
│   ├── repositories/         # Data access layer
│   └── utils/                # Utility functions
├── migrations/               # Alembic migrations
├── tests/                   # Unit and integration tests
├── Dockerfile              # Container definition
└── requirements.txt        # Python dependencies
```

#### Key Components

**Wizard Flow Manager**
```python
class WizardFlowManager:
    async def create_session(self, user_id: UUID) -> WizardSession
    async def get_session(self, session_id: UUID) -> WizardSession
    async def update_step(self, session_id: UUID, step: int, data: dict)
    async def validate_step(self, session_id: UUID, step: int) -> ValidationResult
    async def get_recommendations(self, session_id: UUID) -> List[Recommendation]
```

**Service Orchestrator**
```python
class ServiceOrchestrator:
    async def generate_content(self, request: ContentRequest) -> ContentResponse
    async def recommend_themes(self, criteria: ThemeCriteria) -> List[Theme]
    async def setup_integrations(self, config: IntegrationConfig) -> IntegrationResult
    async def analyze_store(self, store_config: StoreConfig) -> AnalysisResult
```

### LLM Service (store-wizard-llm-service)

#### Dependencies
```python
openai==1.3.0
anthropic==0.3.11
transformers==4.35.0
torch==2.1.0
accelerate==0.24.0
sentence-transformers==2.2.2
langchain==0.0.335
```

#### Model Management
```python
class ModelManager:
    def __init__(self):
        self.openai_client = AsyncOpenAI()
        self.anthropic_client = AsyncAnthropic()
        self.local_models = {}
    
    async def generate_content(self, prompt: str, model: str = "gpt-4") -> str
    async def get_embeddings(self, text: str) -> List[float]
    async def analyze_sentiment(self, text: str) -> SentimentScore
```

#### Prompt Templates
```python
PRODUCT_DESCRIPTION_PROMPT = """
Generate an SEO-optimized product description for:
Product: {product_name}
Category: {category}
Key Features: {features}
Target Audience: {audience}
Brand Voice: {voice}

Requirements:
- 150-200 words
- Include relevant keywords naturally
- Highlight benefits over features
- Include emotional triggers
- End with clear call-to-action
"""
```

### Database Schema

#### Core Tables
```sql
-- Wizard sessions with progress tracking
CREATE TABLE wizard_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    current_step INTEGER DEFAULT 1,
    configuration JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_step CHECK (current_step BETWEEN 1 AND 6)
);

-- Store configurations with versioning
CREATE TABLE store_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    business_info JSONB NOT NULL,
    product_config JSONB DEFAULT '{}',
    theme_settings JSONB DEFAULT '{}',
    integrations JSONB DEFAULT '{}',
    content_data JSONB DEFAULT '{}',
    seo_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated content with quality scores
CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES store_configs(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_data JSONB NOT NULL,
    prompt_used TEXT,
    model_used VARCHAR(50),
    quality_score FLOAT,
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theme recommendations with performance data
CREATE TABLE theme_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    theme_id VARCHAR(100) NOT NULL,
    theme_name VARCHAR(200) NOT NULL,
    industry_category VARCHAR(100),
    recommendation_score FLOAT,
    performance_data JSONB,
    customizations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration tracking and status
CREATE TABLE integration_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    configuration JSONB DEFAULT '{}',
    error_message TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and performance tracking
CREATE TABLE wizard_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_wizard_sessions_user_id ON wizard_sessions(user_id);
CREATE INDEX idx_wizard_sessions_updated_at ON wizard_sessions(updated_at);
CREATE INDEX idx_store_configs_session_id ON store_configs(session_id);
CREATE INDEX idx_generated_content_store_id ON generated_content(store_id);
CREATE INDEX idx_generated_content_type ON generated_content(content_type);
CREATE INDEX idx_theme_recommendations_session_id ON theme_recommendations(session_id);
CREATE INDEX idx_integration_status_session_id ON integration_status(session_id);
CREATE INDEX idx_wizard_analytics_session_id ON wizard_analytics(session_id);
CREATE INDEX idx_wizard_analytics_event_type ON wizard_analytics(event_type);
CREATE INDEX idx_wizard_analytics_timestamp ON wizard_analytics(timestamp);
```

#### Redis Cache Structure
```python
# Session cache keys
session_cache_key = f"wizard:session:{session_id}"
user_sessions_key = f"wizard:user:{user_id}:sessions"

# Content generation cache
content_cache_key = f"wizard:content:{content_hash}"
theme_cache_key = f"wizard:themes:{industry}:{style}"

# Rate limiting
rate_limit_key = f"wizard:rate:{user_id}:{endpoint}"

# Integration tokens
integration_token_key = f"wizard:token:{integration_type}:{user_id}"
```

## API Design

### Authentication & Authorization
```python
# JWT token structure
{
    "sub": "user_id",
    "exp": 1234567890,
    "iat": 1234567890,
    "scope": ["wizard:read", "wizard:write"],
    "session_id": "uuid"
}

# Rate limiting per user
RATE_LIMITS = {
    "wizard_steps": "10/minute",
    "content_generation": "5/minute", 
    "theme_recommendations": "3/minute",
    "integration_setup": "2/minute"
}
```

### API Endpoints Specification

#### Wizard Management
```python
# Start new wizard session
POST /api/v1/wizard/session
Request: {"user_preferences": {...}}
Response: {"session_id": "uuid", "current_step": 1}

# Get wizard state
GET /api/v1/wizard/session/{session_id}
Response: {
    "session_id": "uuid",
    "current_step": 3,
    "configuration": {...},
    "progress": {"completed_steps": [1, 2], "total_steps": 6}
}

# Update wizard step
PUT /api/v1/wizard/session/{session_id}/step/{step_number}
Request: {"step_data": {...}, "auto_advance": true}
Response: {"success": true, "next_step": 4, "recommendations": [...]}
```

#### Content Generation
```python
# Generate AI content
POST /api/v1/content/generate
Request: {
    "content_type": "product_description",
    "inputs": {"product_name": "...", "features": [...]},
    "options": {"tone": "professional", "length": "medium"}
}
Response: {
    "content": "Generated content...",
    "alternatives": ["Alt 1", "Alt 2"],
    "quality_score": 0.92,
    "seo_keywords": [...]
}
```

#### Theme Recommendations
```python
# Get theme recommendations
GET /api/v1/themes/recommendations?industry={industry}&style={style}
Response: {
    "themes": [
        {
            "id": "theme_001",
            "name": "Modern Minimal",
            "preview_url": "https://...",
            "score": 0.95,
            "features": [...],
            "customization_options": {...}
        }
    ],
    "total": 10,
    "page": 1
}
```

## Performance Optimization

### Caching Strategy
```python
# Multi-level caching
class CacheManager:
    def __init__(self):
        self.redis = Redis()
        self.memory_cache = TTLCache(maxsize=1000, ttl=300)
    
    async def get_cached_content(self, key: str):
        # L1: Memory cache
        if key in self.memory_cache:
            return self.memory_cache[key]
        
        # L2: Redis cache
        value = await self.redis.get(key)
        if value:
            self.memory_cache[key] = value
            return value
        
        return None
```

### Database Optimization
- **Connection Pooling**: asyncpg pool with 10-50 connections
- **Query Optimization**: Use indexes, avoid N+1 queries
- **Read Replicas**: Route analytics queries to read replicas
- **Partitioning**: Partition large tables by date/user_id

### Background Processing
```python
# Async job processing with Redis Streams
class JobProcessor:
    async def enqueue_job(self, job_type: str, payload: dict):
        await self.redis.xadd(
            f"jobs:{job_type}",
            payload,
            maxlen=10000
        )
    
    async def process_jobs(self, job_type: str):
        while True:
            messages = await self.redis.xread(
                {f"jobs:{job_type}": "$"},
                block=1000
            )
            for stream, msgs in messages:
                for msg_id, fields in msgs:
                    await self.handle_job(job_type, fields)
```

## Security Implementation

### Input Validation
```python
# Pydantic models for strict validation
class BusinessInfoInput(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=200)
    industry: str = Field(..., regex=r'^[a-zA-Z0-9_-]+$')
    description: str = Field(..., max_length=1000)
    
    @validator('business_name')
    def validate_business_name(cls, v):
        if any(char in v for char in ['<', '>', '"', "'"]):
            raise ValueError('Invalid characters in business name')
        return v.strip()
```

### Rate Limiting
```python
# Redis-based rate limiting
class RateLimiter:
    async def check_rate_limit(self, user_id: str, endpoint: str) -> bool:
        key = f"rate:{user_id}:{endpoint}"
        current = await self.redis.incr(key)
        
        if current == 1:
            await self.redis.expire(key, 60)  # 1 minute window
        
        limit = RATE_LIMITS.get(endpoint, 10)
        return current <= limit
```

### Data Encryption
```python
# Encrypt sensitive data before storage
class DataEncryption:
    def __init__(self, key: bytes):
        self.cipher_suite = Fernet(key)
    
    def encrypt_sensitive_data(self, data: dict) -> dict:
        sensitive_fields = ['api_keys', 'tokens', 'passwords']
        encrypted_data = data.copy()
        
        for field in sensitive_fields:
            if field in encrypted_data:
                encrypted_data[field] = self.cipher_suite.encrypt(
                    encrypted_data[field].encode()
                ).decode()
        
        return encrypted_data
```

## Deployment Configuration

### Docker Configuration
```dockerfile
# Multi-stage build for API service
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 9020
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9020"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-wizard-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: store-wizard-api
  template:
    metadata:
      labels:
        app: store-wizard-api
    spec:
      containers:
      - name: api
        image: store-wizard-api:latest
        ports:
        - containerPort: 9020
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: wizard-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 9020
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Monitoring & Observability

### Health Checks
```python
@app.get("/healthz")
async def health_check():
    checks = {
        "database": await check_database_connection(),
        "redis": await check_redis_connection(),
        "llm_service": await check_llm_service(),
        "external_apis": await check_external_apis()
    }
    
    healthy = all(checks.values())
    status_code = 200 if healthy else 503
    
    return JSONResponse(
        content={"status": "healthy" if healthy else "unhealthy", "checks": checks},
        status_code=status_code
    )
```

### Metrics Collection
```python
# Prometheus metrics
from prometheus_client import Counter, Histogram, Gauge

wizard_sessions_total = Counter('wizard_sessions_total', 'Total wizard sessions created')
wizard_completion_rate = Gauge('wizard_completion_rate', 'Wizard completion rate')
api_request_duration = Histogram('api_request_duration_seconds', 'API request duration')
``` 