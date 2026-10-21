import getpass

from sqlalchemy import select

from app.auth.models import Role, User
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password


def main() -> None:
    Base.metadata.create_all(bind=engine)

    email = input("Admin email: ").strip().lower()
    first_name = input("First name: ").strip()
    last_name = input("Last name: ").strip()
    phone = input("Mobile number (8 digits, without +973): ").strip()
    password = getpass.getpass("Password (at least 12 characters): ")

    if len(password) < 12:
        print("Password must be at least 12 characters.")
        return

    if not (phone.isdigit() and len(phone) == 8):
        print("Mobile number must be exactly 8 digits.")
        return

    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == email)):
            print("A user with this email already exists.")
            return

        admin = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=f"+973{phone}",
            password_hash=hash_password(password),
            role=Role.admin,
        )
        db.add(admin)
        db.commit()

    print(f"Admin account created for {email}.")


if __name__ == "__main__":
    main()


# To run this Script:
# docker compose exec backend python -m app.scripts.create_admin