import pytest
from app.ai_engine import (
    build_story_prompt,
    build_explanation_prompt,
    build_reflection_prompt,
    build_quiz_prompt,
    build_recommendation_prompt,
    generate_awareness_story,
    explain_user_choice,
    analyze_user_reflection,
    generate_knowledge_check,
    generate_user_recommendations,
    validate_ai_response,
    sanitize_content,
    parse_json_string,
    validate_json_schema,
)

def test_prompt_builder():
    story_p = build_story_prompt("Student", "Beginner")
    assert "Student" in story_p
    assert "Beginner" in story_p

    explain_p = build_explanation_prompt("A suspicious workplace indicator", "Report it safely")
    assert "workplace" in explain_p
    assert "Report" in explain_p

    reflection_p = build_reflection_prompt("I learned to report indicators.", "Hotel Staff")
    assert "Hotel Staff" in reflection_p

    quiz_p = build_quiz_prompt("Parent", "Cyber grooming", "Intermediate")
    assert "Parent" in quiz_p
    assert "Cyber grooming" in quiz_p

    recommend_p = build_recommendation_prompt("Volunteer", "1", "100%", "Empathy")
    assert "Volunteer" in recommend_p

def test_safety_filter():
    # Test graphic pattern rejection
    assert validate_ai_response("This is safe content.") is True
    assert validate_ai_response("A victim was assaulted in the room.") is False

    # Test vocabulary sanitization
    dirty_text = "The victim of trafficking was handcuffed and beaten."
    clean_text = sanitize_content(dirty_text)
    assert "victim" not in clean_text
    assert "survivor" in clean_text
    assert "handcuffed" not in clean_text
    assert "restricted" in clean_text

def test_response_parser():
    raw_markdown = "```json\n{\n  \"key\": \"value\"\n}\n```"
    parsed = parse_json_string(raw_markdown)
    assert parsed == {"key": "value"}
    assert validate_json_schema(parsed, ["key"]) is True
    assert validate_json_schema(parsed, ["missing"]) is False

def test_modular_engines():
    # Verify Story Generator
    story = generate_awareness_story("Student", "Beginner")
    assert "title" in story
    assert "scenario" in story
    assert "choices" in story
    assert "learning_objective" in story

    # Verify Explanation Engine
    explanation = explain_user_choice("Suspicious activities", "Document details")
    assert "explanation" in explanation
    assert "awareness_signs" in explanation

    # Verify Reflection Engine
    reflection = analyze_user_reflection("I learned to log dates.", "Hotel Staff")
    assert "summary" in reflection
    assert "learning_points" in reflection

    # Verify Quiz Engine
    quiz = generate_knowledge_check("Parent", "Safety", "Intermediate")
    assert "questions" in quiz
    assert len(quiz["questions"]) > 0

    # Verify Recommendation Engine
    recommendations = generate_user_recommendations("Volunteer", "2", "80%", "Care")
    assert "recommendations" in recommendations
    assert len(recommendations["recommendations"]) > 0
