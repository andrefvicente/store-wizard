from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://wizard:wizardpass@store-wizard-postgres:5432/storewizard"
    REDIS_URL: str = "redis://store-wizard-redis:6379"
    
    # Security
    JWT_SECRET: str = "wizard-dev-secret-key"
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    CORS_ORIGINS: List[str] = ["http://localhost:9026", "http://localhost:3000"]
    
    # Services URLs
    LLM_SERVICE_URL: str = "http://store-wizard-llm-service:9021"
    CONTENT_GENERATOR_URL: str = "http://store-wizard-content-service:9022"
    THEME_SERVICE_URL: str = "http://store-wizard-theme-service:9023"
    INTEGRATION_SERVICE_URL: str = "http://store-wizard-integration-service:9024"
    
    # API Keys (Optional)
    OPENAI_API_KEY: str = "demo-key"
    CLAUDE_API_KEY: str = "demo-key"
    
    class Config:
        env_file = ".env"

_settings = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings 