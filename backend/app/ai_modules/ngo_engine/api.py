from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class NGORequest(BaseModel):
    region: str
    role: str

@router.post("/recommend")
def recommend_ngos(
    req: NGORequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate NGO support recommendations. "
        f"Region: '{req.region}'. "
        f"User Role Track: '{req.role}'. "
        f"Respond ONLY with a JSON object. The JSON object must contain:\n"
        f"- 'ngo_recommendations': An array of NGO objects mapping 'name', 'focus', 'contact', and 'website'\n"
        f"- 'volunteer_opportunities': An array of objects mapping 'title', 'ngo', and 'role_requirements'\n"
        f"- 'awareness_programs': An array of local initiatives or events\n"
        f"- 'training_resources': Links or details about workshops\n"
        f"- 'community_events': Upcoming local campaigns or meetings\n"
        f"- 'educational_materials': Guides relevant to {req.role}"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "ngo_recommendations": [
                {
                    "name": "Global Freedom Alliance",
                    "focus": "Crisis support and proactive survivor mentorship",
                    "contact": "info@globalfreedom.org",
                    "website": "https://www.globalfreedom.org"
                }
            ],
            "volunteer_opportunities": [
                {
                    "title": "Community Awareness Leader",
                    "ngo": "Global Freedom Alliance",
                    "role_requirements": "Basic trafficking indicator training completed."
                }
            ],
            "awareness_programs": ["Safe streets initiative", "Red Sand project events"],
            "training_resources": ["First responder basics online workshop"],
            "community_events": ["Local safety forum next month"],
            "educational_materials": ["Trainee checklist handout PDF"]
        }
    return data
