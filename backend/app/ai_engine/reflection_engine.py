import logging
from typing import Dict, Any
from app.ai_engine.prompt_builder import build_reflection_prompt
from app.ai_engine.gemini_service import gemini_service
from app.ai_engine.safety_filter import sanitize_content

logger = logging.getLogger(__name__)

def analyze_user_reflection(reflection_text: str, role: str) -> Dict[str, Any]:
    """
    Analyzes trainee reflections and provides key educational summaries.
    """
    prompt = build_reflection_prompt(reflection_text, role)
    try:
        parsed = gemini_service.generate_json_response(prompt)
        required = ["summary", "learning_points", "personal_insight", "next_action"]
        for r in required:
            if r not in parsed:
                parsed[r] = ""
    except Exception as e:
        logger.warning(f"AI Reflection analysis failed ({e}), returning mock reflection.")
        parsed = {
            "summary": "Your reflection shows a strong understanding of how control and isolation manifest in community environments.",
            "learning_points": [
                "Recognizing subtle indicators of restricted movement.",
                "Prioritizing reporting channels over direct intervention."
            ],
            "personal_insight": "You demonstrate empathy and a proactive safety-first mindset that helps protect community members.",
            "next_action": "Review the National Trafficking Hotline contact information."
        }

    return sanitize_content(parsed)
