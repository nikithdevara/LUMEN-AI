import logging
from typing import Dict, Any
from app.ai_engine.prompt_builder import build_recommendation_prompt
from app.ai_engine.gemini_service import gemini_service
from app.ai_engine.safety_filter import sanitize_content

logger = logging.getLogger(__name__)

def generate_user_recommendations(role: str, completed_stories: str, quiz_score: str, reflection: str) -> Dict[str, Any]:
    """
    Compiles actionable safety recommendations matching the user's role and completion logs.
    """
    prompt = build_recommendation_prompt(role, completed_stories, quiz_score, reflection)
    try:
        parsed = gemini_service.generate_json_response(prompt)
        if "recommendations" not in parsed or not isinstance(parsed["recommendations"], list):
            parsed["recommendations"] = []
        for r in parsed["recommendations"]:
            required = ["title", "description", "action"]
            for field in required:
                if field not in r:
                    r[field] = ""
    except Exception as e:
        logger.warning(f"AI Recommendation compile failed ({e}), returning mock recommendations.")
        # Fallback role-specific defaults
        if role.lower() == "student":
            parsed = {
                "recommendations": [
                    {
                        "title": "Campus Safety Guides",
                        "description": "Understand reporting protocols on student campuses and community workspaces.",
                        "action": "Bookmark campus wellness and safety emergency contacts."
                    }
                ]
            }
        elif role.lower() == "parent":
            parsed = {
                "recommendations": [
                    {
                        "title": "Digital Safety Checkups",
                        "description": "Guides to keep families safe online, recognizing digital grooming signs.",
                        "action": "Review privacy configurations on common family devices."
                    }
                ]
            }
        elif role.lower() == "hotel staff":
            parsed = {
                "recommendations": [
                    {
                        "title": "Corporate Reporting Templates",
                        "description": "Understand hospitality procedures for logging and escalation.",
                        "action": "Review corporate standard operating procedures for reporting incidents."
                    }
                ]
            }
        else:
            parsed = {
                "recommendations": [
                    {
                        "title": "Community Outreach Resources",
                        "description": "Join campaigns and share safety brochures to raise neighborhood awareness.",
                        "action": "Read safety guidelines for volunteer outreach coordinators."
                    }
                ]
            }

    return sanitize_content(parsed)
