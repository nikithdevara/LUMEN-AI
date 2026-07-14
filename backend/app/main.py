import logging
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.connection import get_db

from app.core.config import settings
from app.api.routes import api_router
from app.database.connection import engine
from app.database.base import Base
# Make sure all models are imported so Base metadata registers them
import app.models 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize DB Tables at startup
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
    
    # Run automatic database seeding for roles, users, stories, and resources
    def seed_database():
        from app.database.connection import SessionLocal
        from app.database.seeds import seed_all_defaults

        db = SessionLocal()
        try:
            seed_all_defaults(db)
            logger.info("Database seeded successfully.")
        except Exception as se:
            logger.error(f"Error seeding database: {se}")
        finally:
            db.close()

    seed_database()
except Exception as e:
    logger.error(f"Error initializing database tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable response compression using GZip
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Set CORS middleware based on settings configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True if "*" not in settings.ALLOWED_ORIGINS else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom secure headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Custom exception handling to match required error response format:
# {"status": "error", "message": "error description"}
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format a readable validation error message
    err_msgs = [f"{e['loc'][-1]}: {e['msg']}" for e in errors]
    message = ", ".join(err_msgs)
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "message": f"Validation error - {message}"
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal Server Error"
        }
    )

@app.get("/health", tags=["system"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "gemini_api": "configured" if settings.GEMINI_API_KEY else "not_configured"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Database connection offline")

# Include central router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Also support the direct /api/story/ prefix for convenience
# by mounting the stories router at both '/stories' and '/story'
# within the central router (done inside api/routes/__init__.py)

@app.get("/")
def read_root():
    return {
        "status": "success",
        "data": {
            "message": "Welcome to the LUMEN AI Backend API",
            "docs": "/docs"
        }
    }
