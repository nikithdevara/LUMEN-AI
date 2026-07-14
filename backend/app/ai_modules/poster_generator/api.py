from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class PosterGenerateRequest(BaseModel):
    campaign_name: str
    poster_type: str  # College Campaign, School Campaign, NGO Campaign, Hotel Awareness, Community Event, Social Awareness

@router.post("/generate")
def generate_poster(
    req: PosterGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Design an educational awareness poster. "
        f"Campaign Name: '{req.campaign_name}'. "
        f"Poster Type: '{req.poster_type}'. "
        f"Respond ONLY with a JSON object. The JSON object must contain:\n"
        f"- 'headline': A striking, brief headline\n"
        f"- 'subtitle': A clear explanatory subtitle\n"
        f"- 'cta': Call to action (e.g. hotline info or report link)\n"
        f"- 'color_palette': An array of hex color strings suitable for the theme\n"
        f"- 'typography': A JSON object mapping 'header_font' and 'body_font'\n"
        f"- 'image_prompt': A highly descriptive prompt to feed into an illustration engine to build the background graphic\n"
        f"- 'poster_prompt': A layout prompt outlining placement"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "headline": "Spot the Signals. Safe Communities.",
            "subtitle": f"Learn the subtle indicators of exploitation in our {req.poster_type}.",
            "cta": "Call National Safety Hotline: 1-888-373-7888",
            "color_palette": ["#1E3A8A", "#F59E0B", "#FFFFFF"],
            "typography": {"header_font": "Outfit", "body_font": "Inter"},
            "image_prompt": f"Modern flat vector illustration of community hands joining in unity, outline style.",
            "poster_prompt": f"Clean layout for {req.poster_type} featuring prominent headline and visual graphic center."
        }
    return data
