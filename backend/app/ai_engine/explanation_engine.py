import logging
from typing import Dict, Any
from app.ai_engine.prompt_builder import build_explanation_prompt
from app.ai_engine.gemini_service import gemini_service
from app.ai_engine.safety_filter import sanitize_content

logger = logging.getLogger(__name__)

def explain_user_choice(scenario: str, choice: str) -> Dict[str, Any]:
    """
    Evaluates choice select actions and explains educational impact.
    """
    prompt = build_explanation_prompt(scenario, choice)
    try:
        parsed = gemini_service.generate_json_response(prompt)
        required = ["explanation", "awareness_signs", "safer_actions", "key_learning"]
        for r in required:
            if r not in parsed:
                parsed[r] = ""
    except Exception as e:
        logger.warning(f"AI Decision explanation failed ({e}), returning mock explanation.")
        parsed = {
            "explanation": "Reporting through structured channels protects community members from escalating dangers.",
            "awareness_signs": ["Peer isolation", "Extreme control over mobile devices or identification cards."],
            "safer_actions": ["Document dates, times, and observable signals.", "Contact the National Hotline."],
            "key_learning": "Always prioritize safety, documentation, and coordination over direct confrontation."
        }

    return sanitize_content(parsed)
