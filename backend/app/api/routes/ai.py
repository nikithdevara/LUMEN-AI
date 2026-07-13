from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.story import Story, StoryScene
from app.models.interaction import UserChoice, Reflection
from app.models.quiz import QuizQuestion
from app.schemas.ai import ExplainChoiceRequest, ReflectionRequest
from app.schemas.quiz import QuizGenerateRequest
from app.ai_engine import explain_choice, analyze_reflection, generate_quiz
from app.utils.exceptions import LumenException

router = APIRouter()

@router.post("/explain-choice")
def get_explain_choice(
    req: ExplainChoiceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scene = db.query(StoryScene).filter(StoryScene.id == req.scene_id).first()
    if not scene:
        raise LumenException(status_code=404, message="Scene not found")

    # Call AI decision explanation engine
    # Look for matching choice to extract outcomes
    outcome_text = ""
    for choice in (scene.choices_json or []):
        if choice.get("id") == req.selected_choice or choice.get("label") == req.selected_choice or choice.get("text") == req.selected_choice:
            outcome_text = choice.get("outcome", "")
            break

    try:
        explanation_data = explain_choice(
            scenario_text=scene.scenario_text,
            selected_choice=req.selected_choice,
            outcome_text=outcome_text
        )
    except Exception:
        # Fallback explanation
        explanation_data = {
            "why_this_choice_matters": "Taking documented steps helps safety professionals verify patterns of concern.",
            "awareness_signals": "Avoidance of contact and highly structured supervision.",
            "better_actions": "Reach out directly to emergency services if immediate harm is suspected.",
            "learning_takeaway": "Your vigilance and reporting can prevent escalating issues."
        }

    # Record the user's decision
    db_user_choice = UserChoice(
        user_id=req.user_id,
        scene_id=req.scene_id,
        selected_choice=req.selected_choice,
        ai_explanation=explanation_data.get("learning_takeaway", "")
    )
    db.add(db_user_choice)
    db.commit()

    return {
        "status": "success",
        "data": explanation_data
    }

@router.post("/reflection")
def get_reflection(
    req: ReflectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    story = db.query(Story).filter(Story.id == req.story_id).first()
    if not story:
        raise LumenException(status_code=404, message="Story not found")

    # Handle structured inputs or default single reflection text
    learned = req.what_you_learned or req.reflection_text or "General learning insights"
    signs = req.signs_noticed or "Observed control patterns"
    action = req.action_taken or "Report to supervisors"

    try:
        reflection_data = analyze_reflection(
            story_title=story.title,
            what_you_learned=learned,
            signs_noticed=signs,
            action_taken=action
        )
    except Exception:
        # Fallback reflection
        reflection_data = {
            "summary": "Thank you for reflecting on this story. Your commitment to safety is appreciated.",
            "key_lessons": [
                "Recognizing subtle indicators is key.",
                "Reporting concerns safeguards vulnerable peers.",
                "Maintain open safety channels."
            ],
            "personal_insight": "You show strong proactive skills.",
            "recommended_actions": ["Share these takeaways with others."]
        }

    # Record reflection in DB
    db_reflection = Reflection(
        user_id=req.user_id,
        story_id=req.story_id,
        reflection_text=f"Learned: {learned} | Signs: {signs} | Actions: {action}",
        ai_summary=reflection_data.get("summary", ""),
        key_learning=reflection_data.get("key_lessons", [])
    )
    db.add(db_reflection)
    db.commit()

    return {
        "status": "success",
        "data": reflection_data
    }

@router.post("/generate-quiz")
def generate_quiz(
    req: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    story = db.query(Story).filter(Story.id == req.story_id).first()
    if not story:
        raise LumenException(status_code=404, message="Story not found")

    # Check if questions already exist for this story
    existing_questions = db.query(QuizQuestion).filter(QuizQuestion.story_id == req.story_id).all()
    if existing_questions:
        return {
            "status": "success",
            "data": [
                {
                    "id": q.id,
                    "question": q.question,
                    "choices": q.options_json,
                    "correct": int(q.correct_answer),
                    "explanation": q.explanation
                }
                for q in existing_questions
            ]
        }

    # Generate using AI Quiz engine
    try:
        quiz_data = generate_quiz(story_title=story.title, story_description=story.description)
        questions_list = quiz_data.get("questions", [])
    except Exception:
        # Fallback quiz questions
        questions_list = [
            {
                "question": "What is the primary indicator of potential exploitation in a community setting?",
                "choices": [
                    "A person who chooses to eat lunch alone",
                    "An individual whose interactions and movement are strictly controlled by another person",
                    "Someone who prefers cash over electronic payment",
                    "An employee who requests shift switches"
                ],
                "correct": 1,
                "explanation": "Strict control by another person is a strong, observable sign of potential exploitation.",
                "ai_insight": "Control indicates a power dynamic where a person is vulnerable to coercion."
            }
        ]

    db_questions = []
    for q in questions_list:
        db_q = QuizQuestion(
            story_id=req.story_id,
            question=q.get("question", ""),
            options_json=q.get("choices", []),
            correct_answer=str(q.get("correct", 0)),
            explanation=q.get("explanation", "")
        )
        db.add(db_q)
        db_questions.append(db_q)
    db.commit()

    return {
        "status": "success",
        "data": [
            {
                "id": q.id,
                "question": q.question,
                "choices": q.options_json,
                "correct": int(q.correct_answer),
                "explanation": q.explanation
            }
            for q in db_questions
        ]
    }

@router.get("/status")
def get_ai_status():
    from app.core.config import settings
    # Dynamically determine connection status based on API key presence
    status_str = "connected" if settings.GEMINI_API_KEY else "mock"
    return {
        "provider": "Google Gemini",
        "status": status_str
    }
