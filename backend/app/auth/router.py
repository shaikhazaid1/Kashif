from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.models import Role, User
from app.auth.schemas import RegisterRequest, UserOut
from app.core.database import get_db
from app.core.security import hash_password

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