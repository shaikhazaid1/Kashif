from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session


from app.auth.models import Role, User
from app.core.database import get_db
from app.auth.schemas import LoginRequest, RegisterRequest, UserOut
from app.auth.dependencies import get_current_user
from app.core.security import DUMMY_HASH, hash_password, verify_password
from app.auth.cookies import clear_auth_cookies, set_access_cookie, set_mfa_cookie
from app.auth.lockout import is_locked, register_failure, register_success

router = APIRouter(prefix="/api/auth", tags=["auth"])


#########################(/register)#########################

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


#########################(/login)#########################

STAFF_ROLES = {Role.employee, Role.admin}
def invalid_credentials() -> HTTPException:
    return HTTPException(status_code=401, detail="Invalid email or password.")

@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = data.email.lower()
    user = db.scalar(select(User).where(User.email == email))

    if user is None or is_locked(user):
        verify_password(data.password, DUMMY_HASH)
        raise invalid_credentials()

    if not verify_password(data.password, user.password_hash):
        register_failure(user, db)
        raise invalid_credentials()

    if not user.is_active:
        raise invalid_credentials()

    if user.role in STAFF_ROLES:
        set_mfa_cookie(response, user)
        return {"mfa_required": True, "mfa_setup_required": not user.mfa_enabled}

    register_success(user, db)
    set_access_cookie(response, user)
    return {"mfa_required": False, "role": user.role}

#########################(/me)#########################
 
@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

#########################(/logout)#########################


@router.post("/logout", status_code=204)
def logout(response: Response):
    clear_auth_cookies(response)