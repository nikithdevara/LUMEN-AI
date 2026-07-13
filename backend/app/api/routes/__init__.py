from fastapi import APIRouter
from app.api.routes import auth, users, stories, ai, quiz, recommendations

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(stories.router, prefix="/stories", tags=["stories"])
api_router.include_router(stories.router, prefix="/story", tags=["story"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
