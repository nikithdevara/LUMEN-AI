from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class PresentationRequest(BaseModel):
    topic: str
    slides_count: int = 5

@router.post("/generate")
def generate_presentation(
    req: PresentationRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate a presentation structure for a lecture. "
        f"Topic: '{req.topic}'. "
        f"Slides Count: {req.slides_count}. "
        f"Respond ONLY with a JSON object containing:\n"
        f"- 'title': Slide deck title\n"
        f"- 'agenda': Array of bullet points outlining the deck\n"
        f"- 'slides': An array of slide objects. Each object should map 'slide_number', 'title', 'bullets' (list of strings), 'speaker_notes' (string), and 'visual_suggestions' (string)\n"
        f"- 'export_ready_json': A simplified serialization of the slides data"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "title": f"Understanding & Mitigating {req.topic}",
            "agenda": ["Introduction to indicators", "Recognizing coercion", "Safe intervention paths"],
            "slides": [
                {
                    "slide_number": 1,
                    "title": "Welcome & Introduction",
                    "bullets": ["Defining the landscape", "Why awareness is critical"],
                    "speaker_notes": "Introduce yourself and explain the primary objectives of today's learning session.",
                    "visual_suggestions": "Clean minimalistic slide with professional title layout."
                }
            ],
            "export_ready_json": {"serialized": True, "count": req.slides_count}
        }
    return data
