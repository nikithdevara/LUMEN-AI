from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User, Role
from app.models.interaction import Resource
from app.schemas.ai import ResourceOut
from app.utils.exceptions import LumenException

router = APIRouter()

@router.get("")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role = db.query(Role).filter(Role.id == current_user.role_id).first()
    role_name = role.role_name if role else "Student"

    # Define standard categories based on role
    category_map = {
        "Student": "Learning Resources",
        "Parent": "Community Actions",
        "Hotel Staff": "Safety Guidelines",
        "Volunteer": "Awareness Materials"
    }
    target_category = category_map.get(role_name, "Learning Resources")

    # Check if resources exist in database, else seed them
    resources = db.query(Resource).filter(Resource.category == target_category).all()
    if not resources:
        # Seed standard resources
        seed_data = [
            # Student Resources
            Resource(
                title="Understanding the Signs of Online Coercion",
                description="A guide for students to recognize grooming behaviors online.",
                category="Learning Resources",
                resource_url="https://lumen-ai.org/resources/online-signs"
            ),
            Resource(
                title="Peer Support and Community Vigilance",
                description="How to step in and offer support to peers in high school or college.",
                category="Learning Resources",
                resource_url="https://lumen-ai.org/resources/peer-support"
            ),
            # Parent Resources
            Resource(
                title="Safe Families: Digital Safety Conversations",
                description="Effective conversation starters for discussing online risks with children.",
                category="Community Actions",
                resource_url="https://lumen-ai.org/resources/digital-conversations"
            ),
            Resource(
                title="Building Safe Communities Guide",
                description="Strengthening local networks to protect children and adolescents.",
                category="Community Actions",
                resource_url="https://lumen-ai.org/resources/safe-communities"
            ),
            # Hotel Staff Resources
            Resource(
                title="Workplace Awareness Framework for Hospitality",
                description="Standard operating procedures for checking in guests and identifying indicators.",
                category="Safety Guidelines",
                resource_url="https://lumen-ai.org/resources/hospitality-sop"
            ),
            # Volunteer Resources
            Resource(
                title="Outreach Toolkit & Shareable Material",
                description="Outreach posters and printouts for community awareness boards.",
                category="Awareness Materials",
                resource_url="https://lumen-ai.org/resources/outreach-toolkit"
            )
        ]
        for item in seed_data:
            # Check uniqueness before adding
            existing = db.query(Resource).filter(
                Resource.title == item.title,
                Resource.category == item.category
            ).first()
            if not existing:
                db.add(item)
        db.commit()

        # Re-fetch
        resources = db.query(Resource).filter(Resource.category == target_category).all()

    # If no resources are found, return all available resources as default
    if not resources:
        resources = db.query(Resource).all()

    return {
        "status": "success",
        "data": [
            {
                "id": r.id,
                "title": r.title,
                "description": r.description,
                "category": r.category,
                "resource_url": r.resource_url
            }
            for r in resources
        ]
    }
