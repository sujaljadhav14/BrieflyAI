import os
import logging
import torch
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import SummarizeRequest, SummarizeResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("backend")

summarizer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global summarizer
    model_path = settings.MODEL_PATH
    
    # Check fallback path if not found (e.g. if run from root directory)
    if not os.path.exists(model_path) and os.path.exists("saved_model"):
        model_path = "saved_model"
        
    try:
        from app.summarizer import DialogueSummarizer
        summarizer = DialogueSummarizer(model_path)
    except Exception as e:
        logger.critical(f"Critical error loading model: {str(e)}", exc_info=True)
        raise e
        
    yield
    
    # Shutdown
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    logger.info("Application shutdown complete.")

app = FastAPI(
    title="Dialogue Summarizer API",
    description="FastAPI backend for dialogue summarization using T5-small",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Dialogue Summarizer API is running",
        "endpoints": {
            "health": "/health",
            "summarize": "/summarize (POST)"
        }
    }

@app.get("/health")
def health_check():
    if summarizer is None:
        return {"status": "unhealthy", "error": "Model not loaded"}
    return {
        "status": "healthy",
        "model_loaded": True,
        "device": str(summarizer.device)
    }

@app.post("/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest):
    if summarizer is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not initialized. Please check server logs."
        )
    
    if not request.dialogue.strip():
        raise HTTPException(
            status_code=400,
            detail="Dialogue input cannot be empty."
        )
        
    try:
        summary = summarizer.summarize(request.dialogue)
        return SummarizeResponse(summary=summary)
    except Exception as e:
        logger.error(f"Inference failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {str(e)}"
        )
