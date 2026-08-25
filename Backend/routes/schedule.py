from fastapi import APIRouter, Depends, HTTPException
from models.schedule import Schedule
from database.connection import db
from dependencies.auth import get_current_user
from bson import ObjectId


router = APIRouter(
    prefix="/api/schedule",
    tags=["Schedule"]
)


# =========================
# ADD SCHEDULE
# =========================

@router.post("/")
def add_schedule(
    schedule: Schedule,
    user_id: str = Depends(get_current_user)
):

    data = schedule.model_dump()

    # Token se current user ID
    data["user_id"] = user_id

    result = db.schedules.insert_one(data)

    return {
        "success": True,
        "message": "Schedule added successfully 📅",
        "id": str(result.inserted_id)
    }


# =========================
# GET SCHEDULES
# =========================

@router.get("/")
def get_schedules(
    user_id: str = Depends(get_current_user)
):

    schedules = list(
        db.schedules.find({
            "user_id": user_id
        })
    )

    for schedule in schedules:
        schedule["_id"] = str(schedule["_id"])

    return {
        "success": True,
        "schedules": schedules
    }


# =========================
# GET SINGLE SCHEDULE
# =========================

@router.get("/{schedule_id}")
def get_schedule(
    schedule_id: str,
    user_id: str = Depends(get_current_user)
):

    if not ObjectId.is_valid(schedule_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid schedule ID"
        )

    schedule = db.schedules.find_one({
        "_id": ObjectId(schedule_id),
        "user_id": user_id
    })

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found"
        )

    schedule["_id"] = str(schedule["_id"])

    return {
        "success": True,
        "schedule": schedule
    }


# =========================
# DELETE SCHEDULE
# =========================

@router.delete("/{schedule_id}")
def delete_schedule(
    schedule_id: str,
    user_id: str = Depends(get_current_user)
):

    if not ObjectId.is_valid(schedule_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid schedule ID"
        )

    result = db.schedules.delete_one({
        "_id": ObjectId(schedule_id),
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found"
        )

    return {
        "success": True,
        "message": "Schedule deleted successfully 📅"
    }