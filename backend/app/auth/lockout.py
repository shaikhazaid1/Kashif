from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.auth.models import User

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def is_locked(user: User) -> bool:
    return user.locked_until is not None and user.locked_until > datetime.now(
        timezone.utc
    )


def register_failure(user: User, db: Session) -> None:
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
        user.locked_until = datetime.now(timezone.utc) + timedelta(
            minutes=LOCKOUT_MINUTES
        )
        user.failed_login_attempts = 0
    db.commit()


def register_success(user: User, db: Session) -> None:
    if user.failed_login_attempts or user.locked_until:
        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()