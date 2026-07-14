from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.ai_engine.gemini_service import gemini_service

router = APIRouter()

class VideoScriptRequest(BaseModel):
    topic: str
    format_type: str  # Short Reel, Workshop Video, Public Awareness Video

@router.post("/generate")
def generate_video_script(
    req: VideoScriptRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = (
        f"Generate an awareness video script packet. "
        f"Topic: '{req.topic}'. "
        f"Format: '{req.format_type}'. "
        f"Respond ONLY with a JSON object. The JSON object must contain:\n"
        f"- 'video_title': Working title of the video\n"
        f"- 'format': The format type\n"
        f"- 'storyboard': An array of scene objects. Each scene must map 'scene_number', 'visual_description' (visual prompts), 'narration' (speaker lines), and 'audio_notes' (music or effects)\n"
        f"- 'narrative_summary': Brief description of the overall video flow\n"
        f"- 'call_to_action': Closing slide and voiceover details"
    )

    try:
        data = gemini_service.generate_json_response(prompt)
    except Exception:
        data = {
            "video_title": f"Spotting the Signals: {req.topic}",
            "format": req.format_type,
            "storyboard": [
                {
                    "scene_number": 1,
                    "visual_description": "Close up of a smart phone showing repeated alert notifications. Soft warm room lighting.",
                    "narration": "In our connected world, indicators of exploitation can hide in plain sight.",
                    "audio_notes": "Low atmospheric synthesizer music building slowly."
                }
            ],
            "narrative_summary": "A high-impact short video designed to prompt citizens to recognize control indicators.",
            "call_to_action": "Help keep our communities safe. Learn the signals at LUMEN AI."
        }
    return data
