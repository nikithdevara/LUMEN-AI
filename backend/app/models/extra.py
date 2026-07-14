from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    badge_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    earned = Column(Boolean, default=True)
    earned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="achievements")

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    action = Column(String, nullable=False)  # e.g., "story_started", "quiz_completed"
    details = Column(JSON, nullable=True)     # arbitrary metadata
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="analytics")

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, unique=True, nullable=False)
    dark_mode = Column(Boolean, default=False)
    email_notifications = Column(Boolean, default=True)
    profile_visible = Column(Boolean, default=True)

    user = relationship("User", backref="settings")

class GeneratedContent(Base):
    __tablename__ = "generated_content"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    content_type = Column(String, nullable=False)  # e.g., "document", "presentation", "social"
    title = Column(String, nullable=False)
    body_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="generated_contents")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    campaign_name = Column(String, nullable=False)
    objectives = Column(JSON, nullable=True)
    audience = Column(String, nullable=True)
    details_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="campaigns_list")

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    prompt = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="images_list")
