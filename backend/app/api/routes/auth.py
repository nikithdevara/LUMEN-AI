from datetime import timedelta
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User, Role
from app.schemas.auth import UserRegister, UserLogin
from app.core import security
from app.utils.exceptions import LumenException

router = APIRouter()

@router.post("/register")
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise LumenException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Email already registered"
        )
    
    # Hash password
    password_hash = security.get_password_hash(user_in.password)
    
    # Assign default role (e.g. "Student" or leave empty)
    # Check if roles are populated, otherwise we initialize them
    student_role = db.query(Role).filter(Role.role_name == "Student").first()
    if not student_role:
        # Populate standard roles dynamically if missing
        for r_name in ["Student", "Parent", "Hotel Staff", "Volunteer"]:
            if not db.query(Role).filter(Role.role_name == r_name).first():
                db.add(Role(role_name=r_name))
        db.commit()
        student_role = db.query(Role).filter(Role.role_name == "Student").first()

    db_user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=password_hash,
        role_id=student_role.id if student_role else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = security.create_access_token(subject=db_user.email)

    return {
        "status": "success",
        "data": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": student_role.role_name if student_role else None,
            "access_token": access_token
        }
    }

@router.post("/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not security.verify_password(user_in.password, user.password_hash):
        raise LumenException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Incorrect email or password"
        )
    
    access_token = security.create_access_token(subject=user.email)
    
    return {
        "status": "success",
        "data": {
            "access_token": access_token,
            "token_type": "bearer"
        }
    }
