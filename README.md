# NEXT BASKET Store Launch Wizard

An AI-powered microservice that guides users through complete e-commerce store setup, from configuration to launch readiness. Supports only Next Basket (Self and Pro plans).

## 🚀 Quick Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for UI development)
- Python 3.11+ (for local API development)

### Start Services
```bash
cd store-wizard
cp .env.example .env  # Edit with your API keys
docker-compose up -d
```

### Service Ports
| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 9020 | Main API service |
| LLM Service | 9021 | AI content generation |
| Content Service | 9022 | Marketing content |
| Theme Service | 9023 | Design recommendations |
| Integration Service | 9024 | Third-party integrations |
| Analytics Service | 9025 | Performance analytics |
| UI Service | 9026 | React frontend |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Service    │    │  API Gateway    │    │ LLM Service     │
│   (React)       │◄──►│   (FastAPI)     │◄──►│ (GPT-4/Llama)   │
│   Port: 9026    │    │   Port: 9020    │    │ Port: 9021      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Content Service │    │ Theme Service   │    │Integration Svc  │
│ (Content Gen)   │    │ (Design AI)     │    │ (3rd Party)     │
│ Port: 9022      │    │ Port: 9023      │    │ Port: 9024      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Analytics Service│    │   PostgreSQL    │    │     Redis       │
│ (ML/Analytics)  │    │   (Primary DB)  │    │   (Cache/Queue) │
│ Port: 9025      │    │ Port: 5437      │    │ Port: 6383      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Backend**: Python 3.11+ with FastAPI, PostgreSQL 16, Redis 7
- **Frontend**: React 18 with TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4 and Meta Llama-3
- **Infrastructure**: Docker, Kubernetes-ready, Prometheus + Grafana



## 🧪 Development

### Local Development
```bash
# API Development
cd services/api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 9020

# UI Development
cd services/ui
npm install && npm run dev
```

### Testing
```bash
# API tests
cd services/api && pytest

# UI tests
cd services/ui && npm test

# Integration tests
docker-compose -f docker-compose.test.yml up --build
```

## 📊 Monitoring

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **API Docs**: http://localhost:9020/docs

## 🔧 Configuration

### Required Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@localhost:5437/storewizard
REDIS_URL=redis://localhost:6383
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
```

### Feature Flags
- `ENABLE_GPT4_CONTENT`: Use GPT-4 for content generation
- `ENABLE_THEME_AI`: AI-powered theme recommendations
- `ENABLE_INTEGRATION_AUTO_SETUP`: Automatic integration setup


## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for the e-commerce community 