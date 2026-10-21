from fastapi import APIRouter, Depends

from app.auth.dependencies import require_role
from app.auth.models import Role, User

router = APIRouter(prefix="/api/staff", tags=["staff"])


@router.get("/ping")
def staff_ping(
    current_user: User = Depends(require_role(Role.employee, Role.admin)),
):
    return {
        "message": f"Hello {current_user.first_name}, you have staff access.",
        "role": current_user.role,
    }


@router.get("/admin-ping")
def admin_ping(current_user: User = Depends(require_role(Role.admin))):
    return {
        "message": f"Hello {current_user.first_name}, you have admin access.",
        "role": current_user.role,
    }