# AI Engine Module Initialization

from app.ai_engine.gemini_service import (
    generate_content,
    generate_json_response,
)
from app.ai_engine.prompt_builder import (
    build_story_prompt,
    build_explanation_prompt,
    build_reflection_prompt,
    build_quiz_prompt,
    build_recommendation_prompt,
)
from app.ai_engine.story_generator import generate_awareness_story
from app.ai_engine.explanation_engine import explain_user_choice
from app.ai_engine.reflection_engine import analyze_user_reflection
from app.ai_engine.quiz_engine import generate_knowledge_check
from app.ai_engine.recommendation_engine import generate_user_recommendations
from app.ai_engine.safety_filter import (
    validate_ai_response,
    sanitize_content,
)
from app.ai_engine.response_parser import (
    parse_json_string,
    validate_json_schema,
)

# Export legacy compatibility functions mapped to our modular components
generate_story = generate_awareness_story
explain_choice = explain_user_choice
analyze_reflection = analyze_user_reflection
generate_quiz = generate_knowledge_check
generate_recommendations = generate_user_recommendations
