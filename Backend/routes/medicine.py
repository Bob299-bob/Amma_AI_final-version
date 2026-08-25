from fastapi import APIRouter,Depends
from models.medicine import Medicine
from database.connection import db
from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/medicines",
    tags=["Medicines"]
)


@router.post("/")
def add_medicine(medicine: Medicine,
                 user_id: str = Depends(get_current_user)):

    data = medicine.model_dump()
    data["user_id"] = user_id
    result = db.medicines.insert_one(data)

    return {
        "message": "Medicine added successfully 💊",
        "id": str(result.inserted_id)
    }


@router.get("/")
def get_medicines(user_id: str = Depends(get_current_user)):

    medicines = list(db.medicines.find({
        "user_id": user_id
    }))

    for medicine in medicines:
        medicine["_id"] = str(medicine["_id"])

    return medicines


@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: str,
                    user_id: str = Depends(get_current_user)):

    from bson import ObjectId

    result = db.medicines.delete_one(
        {"_id": ObjectId(medicine_id),
          "user_id": user_id}
    )

    if result.deleted_count == 0:
        return {
            "message": "Medicine not found"
        }

    return {
        "message": "Medicine deleted successfully"
    }