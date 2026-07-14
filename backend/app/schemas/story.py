from pydantic import BaseModel
from typing import List, Optional, Any

class ChoiceSchema(BaseModel):
    id: str
    label: str
    outcome: str
    ai_explanation: str
    is_recommended: bool = False
    next_scene: int

class StorySceneOut(BaseModel):
    id: int
    scene_number: int
    scenario_text: str
    character_information: Optional[str] = None
    choices: List[ChoiceSchema]
    learning_objective: Optional[str] = None

    class Config:
        from_attributes = True

class StoryOut(BaseModel):
    id: int
    title: str
    description: str
    target_role: str
    difficulty: str

    class Config:
        from_attributes = True

class StoryStartRequest(BaseModel):
    user_id: Optional[int] = None
    story_id: int

class StoryContinueRequest(BaseModel):
    user_id: Optional[int] = None
    story_id: int
    selected_choice: str  # The choice label or choice ID

class ProgressUpdateSchema(BaseModel):
    current_scene: int
    completed: bool
    completion_percentage: float
