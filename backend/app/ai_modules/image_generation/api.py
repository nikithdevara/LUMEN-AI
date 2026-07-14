from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_modules.image_generation.validator import ImageGenerationRequest, ImageGenerationResponse
from app.ai_modules.image_generation.image_service import generate_educational_illustration

router = APIRouter()

@router.post("/generate", response_model=ImageGenerationResponse)
def api_generate_image(
    req: ImageGenerationRequest,
    current_user: User = Depends(get_current_user)
):
    return generate_educational_illustration(
        story=req.story,
        characters=req.characters,
        location=req.location,
        emotion=req.emotion
    )
