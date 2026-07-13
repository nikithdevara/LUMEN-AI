from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User, Role
from app.models.story import UserStoryProgress
from app.models.quiz import QuizQuestion, QuizResult
from app.schemas.quiz import QuizSubmitRequest
from app.ai_engine import generate_recommendations
from app.utils.exceptions import LumenException

router = APIRouter()

@router.post("/submit")
def submit_quiz(
    req: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch questions for this story
    questions = db.query(QuizQuestion).filter(QuizQuestion.story_id == req.story_id).all()
    if not questions:
        raise LumenException(status_code=404, message="No quiz questions found for this story")

    # Calculate score
    total_q = len(questions)
    correct_count = 0
    
    # Simple dictionary map for fast lookup
    question_map = {q.id: q for q in questions}

    # If submitted answers have question_idx (indices), we can match by index or ID
    for idx, ans in enumerate(req.answers):
        # Fallback index matching if ID is not referenced
        if idx < total_q:
            correct_ans_str = questions[idx].correct_answer
            # Handle float/int conversions cleanly
            try:
                if int(float(correct_ans_str)) == ans.selected:
                    correct_count += 1
            except ValueError:
                if correct_ans_str == str(ans.selected):
                    correct_count += 1

    score = int((correct_count / total_q) * 100) if total_q > 0 else 100

    # Save Quiz Result
    quiz_result = QuizResult(
        user_id=req.user_id,
        score=score
    )
    db.add(quiz_result)

    # Mark user progress as completed
    progress = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == req.user_id,
        UserStoryProgress.story_id == req.story_id
    ).first()

    if progress:
        progress.completed = True
        progress.completion_percentage = 100.0
    else:
        progress = UserStoryProgress(
            user_id=req.user_id,
            story_id=req.story_id,
            current_scene=0,
            completion_percentage=100.0,
            completed=True
        )
        db.add(progress)
    db.commit()

    # Generate quick recommendations using recommendation engine
    role = db.query(Role).filter(Role.id == current_user.role_id).first()
    role_name = role.role_name if role else "Student"
    
    try:
        recs_data = generate_recommendations(
            role=role_name,
            completed_stories_count=1,
            reflections_summary=["Awareness response steps"],
            quiz_scores=[score]
        )
        recommendations = recs_data.get("recommendations", [])
    except Exception:
        recommendations = ["Review reporting pathways", "Understand safety checklists"]

    return {
        "status": "success",
        "data": {
            "score": score,
            "total_questions": total_q,
            "percentage": float(score),
            "progress_updated": True,
            "recommendations": recommendations
        }
    }
