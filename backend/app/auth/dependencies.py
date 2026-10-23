import uuid

import jwt
from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.models import Role, User
from app.core.database import get_db
from app.core.security import decode_token

def get_current_user(
    access_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    not_authenticated = HTTPException(status_code=401, detail="Not authenticated.")

    if access_token is None:
        raise not_authenticated

    try:
        payload = decode_token(access_token, "access")
        user_id = uuid.UUID(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise not_authenticated

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise not_authenticated

    return user


def require_role(*allowed_roles: Role):
    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return checker