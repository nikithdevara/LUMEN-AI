import logging
from typing import Dict, Any
from app.ai_engine.prompt_builder import build_quiz_prompt
from app.ai_engine.gemini_service import gemini_service
from app.ai_engine.safety_filter import sanitize_content

logger = logging.getLogger(__name__)

def generate_knowledge_check(role: str, story_topic: str, difficulty: str) -> Dict[str, Any]:
    """
    Generates dynamic multi-choice quiz questions assessing learning goals.
    """
    prompt = build_quiz_prompt(role, story_topic, difficulty)
    try:
        parsed = gemini_service.generate_json_response(prompt)
        # Ensure we return a questions array
        if "questions" not in parsed or not isinstance(parsed["questions"], list):
            parsed["questions"] = []
        for q in parsed["questions"]:
            required = ["question", "options", "correct_answer", "explanation"]
            for r in required:
                if r not in q:
                    q[r] = ""
    except Exception as e:
        logger.warning(f"AI Quiz generation failed ({e}), returning mock quiz.")
        parsed = {
            "questions": [
                {
                    "question": "Which of the following constitutes a subtle indicator of exploitation in a workplace setting?",
                    "options": [
                        "An employee requesting shift trade schedules.",
                        "A worker appearing controlled, coached, or unable to hold personal ID documentation.",
                        "A team member who prefers independent lunch breaks."
                    ],
                    "correct_answer": "1",
                    "explanation": "Workplace control, monitoring of conversations, or withholding ID papers are key red flags."
                },
                {
                    "question": "What is the safest immediate action to take if suspicious control patterns are observed?",
                    "options": [
                        "Confront the individual suspected of control.",
                        "Log dates, details, and report to verified hotline support services.",
                        "Post descriptions online to get peer suggestions."
                    ],
                    "correct_answer": "1",
                    "explanation": "Safety guidelines dictate using proper documentation and reporting paths."
                }
            ]
        }

    return sanitize_content(parsed)
