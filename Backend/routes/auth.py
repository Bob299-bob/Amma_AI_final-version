from fastapi import APIRouter, HTTPException
from database.connection import db
from models.user import UserCreate, UserLogin

from passlib.context import CryptContext
from jose import jwt

from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def create_token(user_id: str):

    payload = {
        "user_id": user_id
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


@router.post("/register")
def register(user: UserCreate):

    existing_user = db.users.find_one({
        "email": user.email
    })

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    result = db.users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    })

    token = create_token(
        str(result.inserted_id)
    )

    return {
        "success": True,
        "message": "Account created successfully",
        "token": token,
        "user_id": str(result.inserted_id),
        "name": user.name
    }


@router.post("/login")
def login(user: UserLogin):

    existing_user = db.users.find_one({
        "email": user.email
    })

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_correct = pwd_context.verify(
        user.password,
        existing_user["password"]
    )

    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_token(
        str(existing_user["_id"])
    )

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "user_id": str(existing_user["_id"]),
        "name": existing_user["name"]
    }