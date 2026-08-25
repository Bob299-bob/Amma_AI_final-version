from fastapi import APIRouter,Depends
from pydantic import BaseModel
from dependencies.auth import get_current_user

from services.brain import jarvis


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    message: str


@router.post("/")
def chat(request: ChatRequest,user_id: str = Depends(get_current_user)):

    reply = jarvis(
        request.message,
        user_id
    )

    return {
        "success": True,
        "message": request.message,
        "language": "auto",
        "reply": reply
    }