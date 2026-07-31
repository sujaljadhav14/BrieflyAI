import os

class Settings:
    MODEL_PATH: str = os.getenv("MODEL_PATH", "../saved_model")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")

settings = Settings()
