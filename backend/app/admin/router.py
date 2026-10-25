import secrets
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.admin.schemas import StaffCreatedResponse, StaffCreateRequest, StaffOut
from app.auth.dependencies import require_role
from app.auth.models import Role, User
from app.core.database import get_db
from app.core.security import hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])

STAFF_ROLES = [Role.employee, Role.admin] 

TEMP_PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
TEMP_PASSWORD_LENGTH = 16


def generate_temporary_password() -> str:
    return "".join(
        secrets.choice(TEMP_PASSWORD_ALPHABET) for _ in range(TEMP_PASSWORD_LENGTH)
    )


def _get_staff_member(user_id: uuid.UUID, db: Session) -> User:
    user = db.get(User, user_id)
    if user is None or user.role not in STAFF_ROLES:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    return user


@router.get("/staff", response_model=list[StaffOut])
def list_staff(
    admin: User = Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    return db.scalars(
        select(User).where(User.role.in_(STAFF_ROLES)).order_by(User.created_at)
    ).all()


@router.post("/staff", response_model=StaffCreatedResponse, status_code=201)
def create_staff(
    data: StaffCreateRequest,
    admin: User = Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    email = data.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="This email is already registered.")

    temporary_password = generate_temporary_password()

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=email,
        phone=f"+973{data.phone}",
        password_hash=hash_password(temporary_password),
        role=Role.employee,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"user": user, "temporary_password": temporary_password}


@router.post("/staff/{user_id}/deactivate", response_model=StaffOut)
def deactivate_staff(
    user_id: uuid.UUID,
    admin: User = Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    user = _get_staff_member(user_id, db)
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot deactivate your own account.")
    user.is_active = False
    db.commit()
    return user


@router.post("/staff/{user_id}/activate", response_model=StaffOut)
def activate_staff(
    user_id: uuid.UUID,
    admin: User = Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    user = _get_staff_member(user_id, db)
    user.is_active = True
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return user


@router.post("/staff/{user_id}/reset-mfa", response_model=StaffOut)
def reset_staff_mfa(
    user_id: uuid.UUID,
    admin: User = Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    user = _get_staff_member(user_id, db)
    user.mfa_secret = None
    user.mfa_enabled = False
    db.commit()
    return user