import pyotp
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.auth.cookies import clear_auth_cookies, set_access_cookie
from app.auth.dependencies import get_mfa_pending_user
from app.auth.models import User
from app.auth.schemas import MfaCodeRequest
from app.core.database import get_db

router = APIRouter(prefix="/api/auth/mfa", tags=["mfa"])

MFA_ISSUER = "Kashif"


@router.post("/setup")
def mfa_setup(
    user: User = Depends(get_mfa_pending_user),
    db: Session = Depends(get_db),
):
    if user.mfa_enabled:
        raise HTTPException(status_code=409, detail="MFA is already set up.")

    if not user.mfa_secret:
        user.mfa_secret = pyotp.random_base32()
        db.commit()
    secret = user.mfa_secret

    otpauth_uri = pyotp.TOTP(secret).provisioning_uri(
        name=user.email, issuer_name=MFA_ISSUER
    )
    return {"otpauth_uri": otpauth_uri, "secret": secret}


@router.post("/verify")
def mfa_verify(
    data: MfaCodeRequest,
    response: Response,
    user: User = Depends(get_mfa_pending_user),
    db: Session = Depends(get_db),
):
    if not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA is not set up yet.")

    if not pyotp.TOTP(user.mfa_secret).verify(data.code, valid_window=1):
        raise HTTPException(status_code=401, detail="Invalid code.")

    if not user.mfa_enabled:
        user.mfa_enabled = True
        db.commit()

    clear_auth_cookies(response)
    set_access_cookie(response, user)
    return {"message": "Verified", "role": user.role}