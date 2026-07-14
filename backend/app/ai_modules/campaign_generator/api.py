from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class CampaignGenerateRequest(BaseModel):
    topic: str
    target_audience: str
    location: str

@router.post("/generate")
def generate_campaign(
    req: CampaignGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate a comprehensive awareness campaign. "
        f"Topic: '{req.topic}'. "
        f"Audience: '{req.target_audience}'. "
        f"Location: '{req.location}'. "
        f"Respond ONLY with a JSON object containing:\n"
        f"- 'campaign_name': Name of the campaign\n"
        f"- 'objectives': A list of key goals\n"
        f"- 'audience': Re-targeted user persona description\n"
        f"- 'timeline': An array of weekly checkpoints\n"
        f"- 'activities': A list of awareness-building events\n"
        f"- 'social_posts': Suggested posts list\n"
        f"- 'poster_concepts': Ideas for visual media prints\n"
        f"- 'workshop_plan': Summary agenda for a community class\n"
        f"- 'resources': List of logistics materials needed\n"
        f"- 'expected_impact': Assessment of outreach success indicators"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "campaign_name": f"LUMEN Initiative: {req.topic} Awareness",
            "objectives": ["Increase reports of concern", "Educate critical community stakeholders"],
            "audience": req.target_audience,
            "timeline": ["Week 1: Material Design", "Week 2: Social Launch", "Week 3: In-person Workshops"],
            "activities": ["Distribute handouts", "Run information booths"],
            "social_posts": [{"platform": "Instagram", "hook": "Recognize the signals around you."}],
            "poster_concepts": ["Visual graphic displaying safety hotlines"],
            "workshop_plan": "1-hour workshop covering key indicators, myths vs realities, and reporting.",
            "resources": ["Handouts", "Presentation decks", "Safety brochures"],
            "expected_impact": "100+ community members educated, leading to improved proactive vigilance."
        }
    return data
