import enum
import uuid
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Boolean, DateTime, Enum, Integer, String, func

from app.core.database import Base


class Role(str, enum.Enum):
    citizen = "citizen"
    employee = "employee"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(75))
    last_name: Mapped[str] = mapped_column(String(75))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(16))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role, name="user_role"), default=Role.citizen)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    #A shared attribute between the server and the mobile device. It is of type `str | None`, meaning it can be empty (e.g., if citizens do not have it, or if an employee has not yet configured it).
    mfa_secret: Mapped[str | None] = mapped_column(String(64), default=None) 
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())