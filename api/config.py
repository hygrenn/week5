from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str = "http://localhost:8000/api/auth/callback"

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 24

    polar_access_token: str
    polar_webhook_secret: str
    polar_product_id: str

    frontend_url: str = "http://localhost:5173"
    database_url: str = "sqlite:///./app.db"

    class Config:
        env_file = "../.env"  # api/ 에서 실행 시 상위 디렉토리의 .env 참조


settings = Settings()
