from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):

    #Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/saleslens"

    #App
    app_name: str = "SalesLens"
    debug: bool = True

    #Gemini
    gemini_api_key: str = ""

    #Auth
    jwt_secret: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 72

    # Upload
    max_upload_size_mb: int = 10
    upload_dir: str = "uploads"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()

