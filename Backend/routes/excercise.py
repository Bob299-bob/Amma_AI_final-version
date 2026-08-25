from fastapi import APIRouter, Depends, HTTPException
from models.exercise import Exercise
from database.connection import db
from dependencies.auth import get_current_user
from bson import ObjectId


router = APIRouter(
    prefix="/api/exercises",
    tags=["Exercise"]
)


# =========================
# ADD EXERCISE
# =========================

@router.post("/")
def add_exercise(
    exercise: Exercise,
    user_id: str = Depends(get_current_user)
):

    data = exercise.model_dump()

    # Token se current user ID
    data["user_id"] = user_id

    result = db.exercises.insert_one(data)

    return {
        "success": True,
        "message": "Exercise added successfully 🏃",
        "id": str(result.inserted_id)
    }


# =========================
# GET EXERCISES
# =========================

@router.get("/")
def get_exercises(
    user_id: str = Depends(get_current_user)
):

    exercises = list(
        db.exercises.find({
            "user_id": user_id
        })
    )

    for exercise in exercises:
        exercise["_id"] = str(exercise["_id"])

    return {
        "success": True,
        "exercises": exercises
    }


# =========================
# DELETE EXERCISE
# =========================

@router.delete("/{exercise_id}")
def delete_exercise(
    exercise_id: str,
    user_id: str = Depends(get_current_user)
):

    # Invalid ObjectId check
    if not ObjectId.is_valid(exercise_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid exercise ID"
        )

    result = db.exercises.delete_one({
        "_id": ObjectId(exercise_id),
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )

    return {
        "success": True,
        "message": "Exercise deleted successfully 🏃"
    }