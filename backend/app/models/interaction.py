from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class UserChoice(Base):
    __tablename__ = "user_choices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scene_id = Column(Integer, ForeignKey("story_scenes.id"), nullable=False)
    selected_choice = Column(String, nullable=False)
    ai_explanation = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="choices")
    scene = relationship("StoryScene", back_populates="choices_made")

class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    reflection_text = Column(String, nullable=False)
    ai_summary = Column(String, nullable=True)
    key_learning = Column(JSON, nullable=True)  # Can store list/array of key learnings
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reflections")
    story = relationship("Story", back_populates="reflections")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g., Learning Resources, Safety Guidelines, etc.
    resource_url = Column(String, nullable=False)
