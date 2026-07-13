from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User, Role
from app.models.story import Story, StoryScene, UserStoryProgress
from app.schemas.story import StoryStartRequest, StoryContinueRequest
from app.ai_engine import generate_story
from app.utils.exceptions import LumenException

router = APIRouter()

@router.get("")
def list_stories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == current_user.role_id).first()
    user_role = role.role_name if role else "Student"
    
    stories = db.query(Story).filter(Story.target_role == user_role).all()
    
    # If no stories exist for this role, automatically generate one using the AI Story Engine!
    if not stories:
        try:
            story_data = generate_story(role=user_role, difficulty="Beginner")
            db_story = Story(
                title=story_data["title"],
                description=story_data["description"],
                target_role=story_data.get("target_role", user_role),
                difficulty=story_data.get("difficulty", "Beginner")
            )
            db.add(db_story)
            db.commit()
            db.refresh(db_story)
            
            for idx, scene in enumerate(story_data.get("scenes", [])):
                # Clean up choices list for both label and text fields
                choices_list = []
                for c in scene.get("choices", []):
                    c_label = c.get("label", c.get("text", ""))
                    c_text = c.get("text", c.get("label", ""))
                    choices_list.append({
                        "id": c.get("id", ""),
                        "label": c_label,
                        "text": c_text,
                        "outcome": c.get("outcome", ""),
                        "ai_explanation": c.get("ai_explanation", ""),
                        "is_recommended": c.get("is_recommended", False),
                        "next_scene": c.get("next_scene", idx + 1)
                    })
                
                db_scene = StoryScene(
                    story_id=db_story.id,
                    scene_number=scene.get("scene_number", idx),
                    scenario_text=scene.get("scenario", scene.get("scenario_text", "")),
                    character_information=scene.get("character_information", ", ".join(scene.get("reflection_points", []))),
                    choices_json=choices_list,
                    learning_objective=scene.get("learning_objective", "")
                )
                db.add(db_scene)
            db.commit()
            stories = [db_story]
        except Exception as e:
            # Fallback story
            db_story = Story(
                title=f"{user_role} Awareness Essentials",
                description="Learn the primary warning signs and safe actions to protect yourself and peers.",
                target_role=user_role,
                difficulty="Beginner"
            )
            db.add(db_story)
            db.commit()
            db.refresh(db_story)
            
            db_scene = StoryScene(
                story_id=db_story.id,
                scene_number=0,
                scenario_text="You notice suspicious behavior in your community workspace. Someone is restricted from talking directly to others and seems fearful.",
                character_information="A local community worker named Casey.",
                choices_json=[
                    {
                        "id": "c1",
                        "label": "Document your observations and contact support/hotline",
                        "outcome": "You logged details safely and notified hotlines without direct risk.",
                        "ai_explanation": "Recommended. Safety-first protocols allow authorities to handle the threat.",
                        "is_recommended": True,
                        "next_scene": 1
                    },
                    {
                        "id": "c2",
                        "label": "Confront the suspect on your own",
                        "outcome": "The suspect leaves and the situation becomes dangerous.",
                        "ai_explanation": "Not recommended. Direct confrontation escalates risk for everyone involved.",
                        "is_recommended": False,
                        "next_scene": 1
                    }
                ],
                learning_objective="Understand the power of safety-first, non-confrontational reporting."
            )
            db.add(db_scene)
            db.commit()
            stories = [db_story]

    return {
        "status": "success",
        "data": [
            {
                "id": s.id,
                "title": s.title,
                "description": s.description,
                "target_role": s.target_role,
                "difficulty": s.difficulty,
                "created_at": s.created_at
            }
            for s in stories
        ]
    }

@router.post("/start")
def start_story(
    req: StoryStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    story = db.query(Story).filter(Story.id == req.story_id).first()
    if not story:
        raise LumenException(status_code=404, message="Story not found")

    # Get the first scene
    first_scene = db.query(StoryScene).filter(
        StoryScene.story_id == req.story_id,
        StoryScene.scene_number == 0
    ).first()

    if not first_scene:
        raise LumenException(status_code=404, message="First scene of story not found")

    # Set or reset progress
    progress = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == req.user_id,
        UserStoryProgress.story_id == req.story_id
    ).first()

    if not progress:
        progress = UserStoryProgress(
            user_id=req.user_id,
            story_id=req.story_id,
            current_scene=0,
            completion_percentage=0.0,
            completed=False
        )
        db.add(progress)
    else:
        progress.current_scene = 0
        progress.completion_percentage = 0.0
        progress.completed = False
    db.commit()

    return {
        "status": "success",
        "data": {
            "story_id": story.id,
            "title": story.title,
            "scene": {
                "id": first_scene.id,
                "scene_number": first_scene.scene_number,
                "scenario_text": first_scene.scenario_text,
                "character_information": first_scene.character_information,
                "choices": first_scene.choices_json,
                "learning_objective": first_scene.learning_objective
            }
        }
    }

@router.post("/continue")
def continue_story(
    req: StoryContinueRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(UserStoryProgress).filter(
        UserStoryProgress.user_id == req.user_id,
        UserStoryProgress.story_id == req.story_id
    ).first()

    if not progress:
        raise LumenException(status_code=400, message="Story has not been started yet")

    current_scene = db.query(StoryScene).filter(
        StoryScene.story_id == req.story_id,
        StoryScene.scene_number == progress.current_scene
    ).first()

    if not current_scene:
        raise LumenException(status_code=404, message="Current scene not found")

    # Find the choice matching the selected choice (by ID or by Label)
    selected = None
    choices = current_scene.choices_json or []
    for c in choices:
        if c.get("id") == req.selected_choice or c.get("label") == req.selected_choice:
            selected = c
            break

    if not selected:
        raise LumenException(status_code=400, message=f"Invalid choice selected: {req.selected_choice}")

    # Determine total scenes in the story
    total_scenes = db.query(StoryScene).filter(StoryScene.story_id == req.story_id).count()
    if total_scenes == 0:
        total_scenes = 1

    next_scene_num = selected.get("next_scene", progress.current_scene + 1)
    
    # Update progress
    is_completed = next_scene_num >= total_scenes or (progress.current_scene + 1) >= total_scenes
    progress.completed = is_completed
    
    if not is_completed:
        progress.current_scene = next_scene_num
        progress.completion_percentage = round(((next_scene_num) / total_scenes) * 100, 2)
    else:
        progress.completion_percentage = 100.0

    db.commit()

    # Get the next scene if not completed
    next_scene = None
    if not is_completed:
        next_scene = db.query(StoryScene).filter(
            StoryScene.story_id == req.story_id,
            StoryScene.scene_number == next_scene_num
        ).first()

    return {
        "status": "success",
        "data": {
            "choice_made": selected,
            "completed": is_completed,
            "completion_percentage": progress.completion_percentage,
            "next_scene": {
                "id": next_scene.id,
                "scene_number": next_scene.scene_number,
                "scenario_text": next_scene.scenario_text,
                "character_information": next_scene.character_information,
                "choices": next_scene.choices_json,
                "learning_objective": next_scene.learning_objective
            } if next_scene else None
        }
    }
