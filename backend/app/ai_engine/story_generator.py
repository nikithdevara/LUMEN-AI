import logging
from typing import Dict, Any
from app.ai_engine.prompt_builder import build_story_prompt
from app.ai_engine.gemini_service import gemini_service
from app.ai_engine.safety_filter import sanitize_content

logger = logging.getLogger(__name__)

def generate_awareness_story(role: str, difficulty: str, age_group: str = "Young Adult") -> Dict[str, Any]:
    """
    Generates an educational awareness training story based on role and difficulty level.
    """
    prompt = build_story_prompt(role, difficulty, age_group)
    try:
        parsed = gemini_service.generate_json_response(prompt)
        # Ensure we return expected keys
        required = ["title", "scenario", "characters", "context", "choices", "learning_objective"]
        for r in required:
            if r not in parsed:
                parsed[r] = ""
    except Exception as e:
        logger.warning(f"AI Story generation failed ({e}), returning mock fallback story.")
        parsed = {
            "title": f"Empowered Choices: {role} Awareness",
            "scenario": f"You notice someone in your {role} circle who seems unusually isolated, and their communication is closely monitored by another person.",
            "characters": ["Taylor", "The Supervisor"],
            "context": "Notice patterns of restricted mobility and close tracking.",
            "choices": [
                {
                    "id": "A",
                    "text": "Document observations and reach out to a trusted safety hotline.",
                    "impact": "You record key signals safely without exposing yourself or others."
                },
                {
                    "id": "B",
                    "text": "Confront the monitor directly.",
                    "impact": "The supervisor restricts Taylor's movements and communication even further."
                }
            ],
            "learning_objective": "Recognize signs of control and know safe reporting protocols."
        }
    
    return sanitize_content(parsed)
