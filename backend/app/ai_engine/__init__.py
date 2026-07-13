from app.ai_engine.gemini_service import (
    gemini_service,
)

# Common interface functions
def generate_story(role: str, difficulty: str) -> dict:
    return gemini_service.generate_story(role, difficulty)

def explain_choice(scenario_text: str, selected_choice: str, outcome_text: str) -> dict:
    return gemini_service.explain_choice(scenario_text, selected_choice, outcome_text)

def analyze_reflection(story_title: str, what_you_learned: str, signs_noticed: str, action_taken: str) -> dict:
    return gemini_service.analyze_reflection(story_title, what_you_learned, signs_noticed, action_taken)

def generate_quiz(story_title: str, story_description: str) -> dict:
    return gemini_service.generate_quiz(story_title, story_description)

def generate_recommendations(role: str, completed_stories_count: int, reflections_summary: list, quiz_scores: list) -> dict:
    return gemini_service.generate_recommendations(role, completed_stories_count, reflections_summary, quiz_scores)
