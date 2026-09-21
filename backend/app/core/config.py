from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuração da aplicação, lida de variáveis de ambiente/.env."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Organizador de Atividades Online - API"
    environment: str = "development"
    log_level: str = "INFO"

    # Lista de origens separadas por vírgula. Mantido como string simples e
    # exposto via `cors_origins_list` para evitar as regras de parsing de
    # listas complexas que o pydantic-settings aplica a variáveis de ambiente.
    cors_origins: str = "http://localhost:3000"

    webhook_secret: str
    webhook_rate_limit_max: int = 30
    webhook_rate_limit_janela_segundos: float = 60.0

    github_api_token: str | None = None

    @property
    def cors_origins_list(self) -> list[str]:
        return [origem.strip() for origem in self.cors_origins.split(",") if origem.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
