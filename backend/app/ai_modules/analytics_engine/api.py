from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.story import UserStoryProgress
from app.models.interaction import Reflection, UserChoice
from app.models.extra import Achievement, Analytics

router = APIRouter()

@router.get("/dashboard")
def get_analytics_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch database metrics
    stories_completed = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == current_user.id,
        UserStoryProgress.completed == True
    ).count()

    stories_in_progress = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == current_user.id,
        UserStoryProgress.completed == False
    ).count()

    reflections_completed = db.query(Reflection).filter(
        Reflection.user_id == current_user.id
    ).count()

    decisions_made = db.query(UserChoice).filter(
        UserChoice.user_id == current_user.id
    ).count()

    achievements_count = db.query(Achievement).filter(
        Achievement.user_id == current_user.id,
        Achievement.earned == True
    ).count()

    # Track simulated usage metrics from analytics logs
    campaigns_generated = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.action == "campaign_generated"
    ).count()

    posters_generated = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.action == "poster_generated"
    ).count()

    content_generated = db.query(Analytics).filter(
        Analytics.user_id == current_user.id,
        Analytics.action == "content_generated"
    ).count()

    # Dynamic grade assessment
    avg_score = 85.0
    from app.models.quiz import QuizResult
    quiz_results = db.query(QuizResult).filter(QuizResult.user_id == current_user.id).all()
    if quiz_results:
        avg_score = sum(q.score for q in quiz_results) / len(quiz_results)

    return {
        "status": "success",
        "data": {
            "telemetry": {
                "stories_completed": stories_completed,
                "stories_in_progress": stories_in_progress,
                "reflections_completed": reflections_completed,
                "decisions_made": decisions_made,
                "achievements_earned": achievements_count
            },
            "ai_generations": {
                "campaigns_generated": campaigns_generated,
                "posters_generated": posters_generated,
                "content_generated": content_generated
            },
            "performance": {
                "average_quiz_score": round(avg_score, 1),
                "learning_pace": "Optimal",
                "engagement_rating": "Highly Engaged"
            },
            "recommended_focus_area": "Proactive safe intervention strategies"
        }
    }
