from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class SocialRequest(BaseModel):
    topic: str
    tone: str = "informative"

@router.post("/generate")
def generate_social_media(
    req: SocialRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate a social media packet. "
        f"Topic: '{req.topic}'. "
        f"Tone: '{req.tone}'. "
        f"Respond ONLY with a JSON object containing:\n"
        f"- 'instagram': A JSON object mapping 'caption', 'hashtags' (list), and 'carousel_slides' (list of strings)\n"
        f"- 'linkedin': A JSON object mapping 'post_body' and 'hashtags' (list)\n"
        f"- 'facebook': A JSON object mapping 'post_body' and 'hashtags' (list)\n"
        f"- 'x_posts': An array of short posts/threads\n"
        f"- 'content_calendar': An array of objects mapping 'day' (Day 1, Day 2) and 'theme'"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "instagram": {
                "caption": "Vigilance creates safe spaces. Learn how you can make a difference.",
                "hashtags": ["LumenAI", "Prevention", "CommunitySafety"],
                "carousel_slides": ["Slide 1: Spot the Signs", "Slide 2: Understand the Context", "Slide 3: Report Safely"]
            },
            "linkedin": {
                "post_body": "Awareness training is critical in hospitality and community groups. Explore how LUMEN leverages interactive AI.",
                "hashtags": ["LumenAI", "CorporateSocialResponsibility", "Training"]
            },
            "facebook": {
                "post_body": "Join us in prioritizing community safety. Knowledge is our strongest preventative tool.",
                "hashtags": ["SafetyFirst", "LumenAI"]
            },
            "x_posts": ["Spotting indicators requires education, not assumption. #LumenAI"],
            "content_calendar": [{"day": "Monday", "theme": "Mythbusters: Trafficking Facts vs Misconceptions"}]
        }
    return data
