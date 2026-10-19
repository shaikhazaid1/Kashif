from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.models import Role, User
from app.core.database import get_db
from app.auth.schemas import LoginRequest, RegisterRequest, UserOut
from app.core.security import DUMMY_HASH, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    email = data.email.lower()

    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status_code=409, detail="This email is already registered.")

    user = User(
        full_name=data.full_name,
        email=email,
        password_hash=hash_password(data.password),
        role=Role.citizen,
    )
    db.add(user)
    db.commit()
    return user

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    email = data.email.lower()
    user = db.scalar(select(User).where(User.email == email))

    if user is None:
        verify_password(data.password, DUMMY_HASH)
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(data.password, user.password_hash) or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {"message": "Login successful", "role": user.role}