from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "StudyFlow API"
    environment: str = "development"
    frontend_url: str = "http://localhost:5173"
    frontend_urls: str | None = None

    database_url: str
    mongo_url: str
    mongo_db_name: str = "studyflow_mongo"

    secret_key: str
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def allowed_frontend_urls(self) -> list[str]:
        raw_urls = self.frontend_urls or self.frontend_url
        return [url.strip().rstrip("/") for url in raw_urls.split(",") if url.strip()]


settings = Settings()
