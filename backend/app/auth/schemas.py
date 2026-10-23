import uuid

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.auth.models import Role


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    first_name: str = Field(min_length=2, max_length=75)
    last_name: str = Field(min_length=2, max_length=75)
    email: EmailStr
    phone: str = Field(pattern=r"^[0-9]{8}$")
    password: str = Field(min_length=12, max_length=128)


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)



class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    phone: str
    role: Role


class MfaCodeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(pattern=r"^[0-9]{6}$")