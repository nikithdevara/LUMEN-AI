from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SettingsSchema(BaseModel):
    dark_mode: bool
    email_notifications: bool
    profile_visible: bool

    class Config:
        from_attributes = True

class SettingsUpdateSchema(BaseModel):
    dark_mode: Optional[bool] = None
    email_notifications: Optional[bool] = None
    profile_visible: Optional[bool] = None

class DashboardStats(BaseModel):
    completed_stories_count: int
    in_progress_stories_count: int
    saved_resources_count: int
    achievements_count: int
    overall_progress_percentage: int
