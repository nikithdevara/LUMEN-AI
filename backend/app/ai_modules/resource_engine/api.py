from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class ResourceRequest(BaseModel):
    role: str
    completed_stories: int
    quiz_score: int
    reflection: str

@router.post("/recommend")
def recommend_resources(
    req: ResourceRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate customized resource recommendations based on learning diagnostics. "
        f"User Role Track: '{req.role}'. "
        f"Completed Stories Count: {req.completed_stories}. "
        f"Quiz Score achieved: {req.quiz_score}. "
        f"User Reflection text: '{req.reflection}'. "
        f"Respond ONLY with a JSON object containing:\n"
        f"- 'articles': An array of recommended articles mapping 'title', 'summary', and 'read_time'\n"
        f"- 'guides': An array of booklets/reference PDFs\n"
        f"- 'videos': Recommended educational videos mapping 'title' and 'duration'\n"
        f"- 'government_resources': Official national resource directories\n"
        f"- 'ngos': Supporting community organizations\n"
        f"- 'hotlines': Immediate emergency reporting phone details\n"
        f"- 'community_programs': Peer-led groups or localized sessions"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "articles": [
                {
                    "title": f"Proactive Safeguards for {req.role}s",
                    "summary": "Step-by-step documentation on identifying indicators in daily operations.",
                    "read_time": "5 min"
                }
            ],
            "guides": ["National Prevention Action Handbook"],
            "videos": [{"title": "Spotting the Signals: A Visual Guide", "duration": "12 min"}],
            "government_resources": ["Department of Health & Human Services Prevention Portal"],
            "ngos": ["Polaris Project", "NHTRC"],
            "hotlines": ["National Human Trafficking Hotline: 1-888-373-7888 (TTY: 711)"],
            "community_programs": ["LUMEN Regional Safety Webinars"]
        }
    return data
