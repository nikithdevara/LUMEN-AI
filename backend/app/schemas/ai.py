from pydantic import BaseModel
from typing import List, Optional

class ExplainChoiceRequest(BaseModel):
    user_id: int
    scene_id: int
    selected_choice: str

class ExplainChoiceResponse(BaseModel):
    why_this_choice_matters: str
    awareness_signals: str
    better_actions: str
    learning_takeaway: str

class ReflectionRequest(BaseModel):
    user_id: int
    story_id: int
    reflection_text: Optional[str] = None
    what_you_learned: Optional[str] = None
    signs_noticed: Optional[str] = None
    action_taken: Optional[str] = None

class ReflectionResponse(BaseModel):
    summary: str
    key_lessons: List[str]
    personal_insight: str
    recommended_actions: List[str]

class ResourceOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    resource_url: str

    class Config:
        from_attributes = True
