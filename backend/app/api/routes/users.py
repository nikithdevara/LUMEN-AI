from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.user import User, Role
from app.schemas.auth import UserRoleUpdate
from app.utils.exceptions import LumenException

router = APIRouter()

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == current_user.role_id).first()
    return {
        "status": "success",
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role_id": current_user.role_id,
            "role_name": role.role_name if role else None
        }
    }

@router.put("/role")
def update_role(
    role_in: UserRoleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role = db.query(Role).filter(Role.role_name == role_in.role_name).first()
    if not role:
        # If roles are empty or if we need to initialize
        if role_in.role_name in ["Student", "Parent", "Hotel Staff", "Volunteer"]:
            role = Role(role_name=role_in.role_name)
            db.add(role)
            db.commit()
            db.refresh(role)
        else:
            raise LumenException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Invalid role: {role_in.role_name}. Supported: Student, Parent, Hotel Staff, Volunteer"
            )

    current_user.role_id = role.id
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role_id": current_user.role_id,
            "role_name": role.role_name
        }
    }
