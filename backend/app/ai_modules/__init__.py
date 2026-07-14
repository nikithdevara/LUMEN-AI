from fastapi import APIRouter
from app.ai_modules.image_generation.api import router as image_router
from app.ai_modules.story_generation.api import router as story_router
from app.ai_modules.poster_generator.api import router as poster_router
from app.ai_modules.campaign_generator.api import router as campaign_router
from app.ai_modules.presentation_generator.api import router as presentation_router
from app.ai_modules.document_generator.api import router as document_router
from app.ai_modules.social_generator.api import router as social_router
from app.ai_modules.ngo_engine.api import router as ngo_router
from app.ai_modules.resource_engine.api import router as resource_router
from app.ai_modules.video_generator.api import router as video_router
from app.ai_modules.analytics_engine.api import router as analytics_router
from app.ai_modules.government_resource_engine.api import router as government_router

ai_modules_router = APIRouter()

ai_modules_router.include_router(image_router, prefix="/image", tags=["ai-image"])
ai_modules_router.include_router(story_router, prefix="/story", tags=["ai-story"])
ai_modules_router.include_router(poster_router, prefix="/poster", tags=["ai-poster"])
ai_modules_router.include_router(campaign_router, prefix="/campaign", tags=["ai-campaign"])
ai_modules_router.include_router(presentation_router, prefix="/presentation", tags=["ai-presentation"])
ai_modules_router.include_router(document_router, prefix="/document", tags=["ai-document"])
ai_modules_router.include_router(social_router, prefix="/social", tags=["ai-social"])
ai_modules_router.include_router(ngo_router, prefix="/ngo", tags=["ai-ngo"])
ai_modules_router.include_router(resource_router, prefix="/resource", tags=["ai-resource"])
ai_modules_router.include_router(video_router, prefix="/video", tags=["ai-video"])
ai_modules_router.include_router(analytics_router, prefix="/analytics", tags=["ai-analytics"])
ai_modules_router.include_router(government_router, prefix="/government", tags=["ai-government"])

