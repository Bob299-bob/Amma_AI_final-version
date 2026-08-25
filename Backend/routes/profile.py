from fastapi import APIRouter, HTTPException, Depends
from models.profile import HealthProfile
from database.connection import db
from dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/profile",
    tags=["Health Profile"]
)


# =========================
# SAVE / UPDATE PROFILE
# =========================

@router.post("/")
def create_profile(
    profile: HealthProfile,
    user_id: str = Depends(get_current_user)
):

    data = profile.model_dump()

    # Token se current user ID
    data["user_id"] = user_id

    # =========================
    # CHECK CURRENT USER PROFILE
    # =========================

    existing_profile = db.health_profiles.find_one({
        "user_id": user_id
    })

    # =========================
    # UPDATE EXISTING PROFILE
    # =========================

    if existing_profile:

        db.health_profiles.update_one(
            {
                "_id": existing_profile["_id"],
                "user_id": user_id
            },
            {
                "$set": data
            }
        )

        updated_profile = db.health_profiles.find_one(
            {
                "_id": existing_profile["_id"],
                "user_id": user_id
            },
            {
                "_id": 0
            }
        )

        return {
            "success": True,
            "message": "Profile updated successfully ❤️",
            "profile": updated_profile
        }

    # =========================
    # CREATE NEW PROFILE
    # =========================

    result = db.health_profiles.insert_one(data)

    saved_profile = db.health_profiles.find_one(
        {
            "_id": result.inserted_id,
            "user_id": user_id
        },
        {
            "_id": 0
        }
    )

    return {
        "success": True,
        "message": "Profile saved successfully ❤️",
        "profile": saved_profile
    }


# =========================
# GET PROFILE
# =========================

@router.get("/")
def get_profile(
    user_id: str = Depends(get_current_user)
):

    profile = db.health_profiles.find_one(
        {
            "user_id": user_id
        },
        {
            "_id": 0
        }
    )

    if not profile:
        return {
            "success": True,
            "profile": None,
            "message": "Profile not found"
        }

    return {
        "success": True,
        "profile": profile
    }