from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class GovernmentResourceRequest(BaseModel):
    role: str
    region: str

@router.post("/recommend")
def recommend_government_resources(
    req: GovernmentResourceRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate official national and state government resources for human trafficking prevention. "
        f"User Role Track: '{req.role}'. "
        f"Region: '{req.region}'. "
        f"Respond ONLY with a JSON object. The JSON object must contain:\n"
        f"- 'hotlines': An array of official government hotlines mapping 'agency', 'number', and 'hours'\n"
        f"- 'assistance_programs': State or federal welfare or emergency relief programs\n"
        f"- 'policy_handbooks': Links or descriptions of official department policy guidelines for {req.role}\n"
        f"- 'legal_contacts': Legal aid portals and law enforcement contact guidelines"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "hotlines": [
                {
                    "agency": "National Human Trafficking Hotline",
                    "number": "1-888-373-7888",
                    "hours": "24/7"
                }
            ],
            "assistance_programs": ["Office for Victims of Crime (OVC) assistance programs"],
            "policy_handbooks": ["Department of Homeland Security Blue Campaign guides"],
            "legal_contacts": ["Department of Justice Civil Rights Division reporting portal"]
        }
    return data
