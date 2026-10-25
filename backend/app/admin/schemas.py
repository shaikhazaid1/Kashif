import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.auth.models import Role


class StaffCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    first_name: str = Field(min_length=2, max_length=75)
    last_name: str = Field(min_length=2, max_length=75)
    email: EmailStr
    phone: str = Field(pattern=r"^[0-9]{8}$")


class StaffOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    phone: str
    role: Role
    is_active: bool
    mfa_enabled: bool
    created_at: datetime


class StaffCreatedResponse(BaseModel):
    user: StaffOut
    temporary_password: str