from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.story import Story, UserStoryProgress
from app.models.interaction import Reflection
from app.models.extra import Achievement
from app.schemas.extra import DashboardStats

router = APIRouter()

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate Completed Stories
    completed_stories_count = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == current_user.id,
        UserStoryProgress.completed == True
    ).count()

    # Calculate In Progress Stories
    in_progress_stories_count = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == current_user.id,
        UserStoryProgress.completed == False
    ).count()

    # Calculate Saved Resources or Completed Reflections
    saved_resources_count = db.query(Reflection).filter(
        Reflection.user_id == current_user.id
    ).count()

    # Dynamic achievements: Auto-seed an achievement if they've completed any story
    if completed_stories_count > 0:
        badge_name = "First Step Badge"
        existing = db.query(Achievement).filter(
            Achievement.user_id == current_user.id,
            Achievement.badge_name == badge_name
        ).first()
        if not existing:
            new_ach = Achievement(
                user_id=current_user.id,
                badge_name=badge_name,
                description="Earned for completing your first interactive learning scenario."
            )
            db.add(new_ach)
            db.commit()

    # Calculate Achievements Count
    achievements_count = db.query(Achievement).filter(
        Achievement.user_id == current_user.id,
        Achievement.earned == True
    ).count()

    # Calculate Overall Progress Percentage
    total_stories = db.query(Story).count()
    if total_stories > 0:
        overall_progress_percentage = int((completed_stories_count / total_stories) * 100)
    else:
        overall_progress_percentage = 0

    return {
        "completed_stories_count": completed_stories_count,
        "in_progress_stories_count": in_progress_stories_count,
        "saved_resources_count": saved_resources_count,
        "achievements_count": achievements_count,
        "overall_progress_percentage": overall_progress_percentage
    }
