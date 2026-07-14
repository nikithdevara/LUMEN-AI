from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.extra import Settings
from app.schemas.extra import SettingsSchema, SettingsUpdateSchema

router = APIRouter()

@router.get("", response_model=SettingsSchema)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = db.query(Settings).filter(Settings.user_id == current_user.id).first()
    if not settings:
        # Auto-create settings if missing
        settings = Settings(
            user_id=current_user.id,
            dark_mode=False,
            email_notifications=True,
            profile_visible=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings

@router.put("", response_model=SettingsSchema)
def update_user_settings(
    settings_in: SettingsUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = db.query(Settings).filter(Settings.user_id == current_user.id).first()
    if not settings:
        settings = Settings(
            user_id=current_user.id,
            dark_mode=False,
            email_notifications=True,
            profile_visible=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    if settings_in.dark_mode is not None:
        settings.dark_mode = settings_in.dark_mode
    if settings_in.email_notifications is not None:
        settings.email_notifications = settings_in.email_notifications
    if settings_in.profile_visible is not None:
        settings.profile_visible = settings_in.profile_visible

    db.commit()
    db.refresh(settings)
    return settings
