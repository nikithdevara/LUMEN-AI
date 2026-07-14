from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class StoryGenerateRequest(BaseModel):
    role: str
    difficulty: str
    age_group: Optional[str] = "Young Adult"

@router.post("/generate")
def advanced_story_generate(
    req: StoryGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate a human trafficking awareness learning scenario for a {req.role} at a {req.difficulty} difficulty level. "
        f"Target audience age group is {req.age_group}. "
        f"Respond ONLY with a JSON object. Do not include markdown code block syntax. The JSON object must contain:\n"
        f"- 'title': The title of the scenario\n"
        f"- 'scenario': A descriptive narrative\n"
        f"- 'characters': A list of string names of characters involved\n"
        f"- 'choices': A list of options. Each option is a JSON object with 'id' (A, B, C), 'label', 'outcome', and 'is_recommended' (boolean)\n"
        f"- 'learning_objectives': A list of key learning objectives strings\n"
        f"- 'discussion_points': A list of discussion prompts or questions"
    )
    
    try:
        data = gemini_service.generate_json_response(prompt)
        # Validate critical keys
        for key in ["title", "scenario", "characters", "choices", "learning_objectives", "discussion_points"]:
            if key not in data:
                raise ValueError(f"Missing required key: {key}")
    except Exception:
        # Fallback payload
        data = {
            "title": f"Empowered Choices: {req.role} track",
            "scenario": f"While serving as a {req.role}, you witness a peer being excessively isolated and monitored.",
            "characters": ["Taylor", "The Supervisor"],
            "choices": [
                {"id": "A", "label": "Safely document observations and alert supervisors.", "outcome": "A safe investigation is started.", "is_recommended": True},
                {"id": "B", "label": "Confront the monitor directly.", "outcome": "The monitor restricts communication further.", "is_recommended": False}
            ],
            "learning_objectives": ["Identify control signals", "Understand safe reporting thresholds"],
            "discussion_points": ["Why is direct confrontation high risk?", "What indicators did you notice first?"]
        }
    return data
