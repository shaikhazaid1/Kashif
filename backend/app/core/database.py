import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

# Read the connection address from the environment (set in docker-compose)
DATABASE_URL = os.environ["DATABASE_URL"]

# pool_pre_ping checks the connection is alive before each use
engine = create_engine(DATABASE_URL, pool_pre_ping=True)


class Base(DeclarativeBase):
    pass