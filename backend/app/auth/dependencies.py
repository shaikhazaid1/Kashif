import uuid

import jwt
from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.models import Role, User
from app.core.database import get_db
from app.core.security import decode_token


def _load_user_from_token(
    token: str | None, token_type: str, db: Session, error: HTTPException
) -> User:
    if token is None:
        raise error

    try:
        payload = decode_token(token, token_type)
        user_id = uuid.UUID(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise error

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise error

    return user


def get_current_user(
    access_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    error = HTTPException(status_code=401, detail="Not authenticated.")
    return _load_user_from_token(access_token, "access", db, error)


def get_mfa_pending_user(
    mfa_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    error = HTTPException(
        status_code=401, detail="Your sign-in session expired. Please sign in again."
    )
    return _load_user_from_token(mfa_token, "mfa", db, error)


def require_role(*allowed_roles: Role):
    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return checker