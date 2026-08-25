from fastapi import APIRouter
from models.entertainment import Entertainment
from database.connection import db
from bson import ObjectId


router = APIRouter(
    prefix="/api/entertainment",
    tags=["Entertainment"]
)


# --------------------------------
# Add Entertainment
# --------------------------------

@router.post("/")
def add_entertainment(item: Entertainment):

    data = item.model_dump()

    result = db.entertainment.insert_one(data)

    return {
        "message": "Entertainment added successfully 🎵",
        "id": str(result.inserted_id)
    }


# --------------------------------
# Get All
# --------------------------------

@router.get("/")
def get_entertainment():

    items = list(
        db.entertainment.find(
            {"active": True}
        )
    )

    for item in items:
        item["_id"] = str(item["_id"])

    return items


# --------------------------------
# Get By Category
# --------------------------------

@router.get("/category/{category}")
def get_by_category(category: str):

    items = list(
        db.entertainment.find(
            {
                "category": category,
                "active": True
            }
        )
    )

    for item in items:
        item["_id"] = str(item["_id"])

    return items


# --------------------------------
# Delete
# --------------------------------

@router.delete("/{item_id}")
def delete_entertainment(item_id: str):

    result = db.entertainment.delete_one(
        {
            "_id": ObjectId(item_id)
        }
    )

    if result.deleted_count == 0:
        return {
            "message": "Entertainment not found"
        }

    return {
        "message": "Entertainment deleted successfully"
    }