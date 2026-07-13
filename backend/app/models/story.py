from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    target_role = Column(String, nullable=False)  # Student, Parent, Hotel Staff, Volunteer
    difficulty = Column(String, nullable=False)   # Beginner, Intermediate, Advanced
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    scenes = relationship("StoryScene", back_populates="story", cascade="all, delete-orphan")
    progress = relationship("UserStoryProgress", back_populates="story", cascade="all, delete-orphan")
    reflections = relationship("Reflection", back_populates="story", cascade="all, delete-orphan")
    quiz_questions = relationship("QuizQuestion", back_populates="story", cascade="all, delete-orphan")

class StoryScene(Base):
    __tablename__ = "story_scenes"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    scene_number = Column(Integer, nullable=False)
    scenario_text = Column(String, nullable=False)
    character_information = Column(String, nullable=True)
    choices_json = Column(JSON, nullable=False)  # Array of choices: {id, label, outcome, is_recommended, next_scene}
    learning_objective = Column(String, nullable=True)

    story = relationship("Story", back_populates="scenes")
    choices_made = relationship("UserChoice", back_populates="scene", cascade="all, delete-orphan")

class UserStoryProgress(Base):
    __tablename__ = "user_story_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    current_scene = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="progress")
    story = relationship("Story", back_populates="progress")
