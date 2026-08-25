from fastapi import APIRouter,Depends
from pydantic import BaseModel
from dependencies.auth import get_current_user


from services.brain import english_jarvis


router = APIRouter(
    prefix="/api/chat/english",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    message: str


@router.post("/")
def english_chat(request: ChatRequest,user_id: str = Depends(get_current_user)):

    reply = english_jarvis(
        request.message,
        user_id
    )

    return {
        "success": True,
        "message": request.message,
        "language": "english",
        "reply": reply
    }