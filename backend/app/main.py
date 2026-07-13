import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

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
except Exception as e:
    logger.error(f"Error initializing database tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
