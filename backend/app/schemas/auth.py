from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    role_id: Optional[int] = None
    role_name: Optional[str] = None

    class Config:
        from_attributes = True

class UserRoleUpdate(BaseModel):
    role_name: str  # Student, Parent, Hotel Staff, Volunteer
