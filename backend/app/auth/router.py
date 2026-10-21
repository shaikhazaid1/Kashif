from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session


from app.auth.models import Role, User
from app.core.database import get_db
from app.auth.schemas import LoginRequest, RegisterRequest, UserOut
from app.auth.dependencies import get_current_user

from app.core.security import (
    ACCESS_TOKEN_MINUTES,
    DUMMY_HASH,
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    email = data.email.lower()

    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status_code=409, detail="This email is already registered.")

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=email,
        phone=f"+973{data.phone}",
        password_hash=hash_password(data.password),
        role=Role.citizen,
    )
    db.add(user)
    db.commit()
    return user

@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = data.email.lower()
    user = db.scalar(select(User).where(User.email == email))

    if user is None:
        verify_password(data.password, DUMMY_HASH)
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(data.password, user.password_hash) or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(str(user.id), user.role.value)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="strict",
        secure=False,
        max_age=ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )
    return {"message": "Login successful", "role": user.role}

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="strict",
    )