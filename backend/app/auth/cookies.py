from fastapi import Response

from app.auth.models import User
from app.core.security import (
    ACCESS_TOKEN_MINUTES,
    MFA_TOKEN_MINUTES,
    create_access_token,
    create_mfa_token,
)

ACCESS_COOKIE = "access_token"
MFA_COOKIE = "mfa_token"
MFA_COOKIE_PATH = "/api/auth/mfa"


def set_access_cookie(response: Response, user: User) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE,
        value=create_access_token(str(user.id), user.role.value),
        httponly=True,
        samesite="strict",
        secure=False,
        max_age=ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )


def set_mfa_cookie(response: Response, user: User) -> None:
    response.set_cookie(
        key=MFA_COOKIE,
        value=create_mfa_token(str(user.id)),
        httponly=True,
        samesite="strict",
        secure=False,
        max_age=MFA_TOKEN_MINUTES * 60,
        path=MFA_COOKIE_PATH,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE, path="/", httponly=True, samesite="strict")
    response.delete_cookie(
        MFA_COOKIE, path=MFA_COOKIE_PATH, httponly=True, samesite="strict"
    )