from fastapi import APIRouter, Depends

from services.reminder import get_today_reminders
from dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/reminders",
    tags=["Reminders"]
)


@router.get("/today")
def today_reminders(
    user_id: str = Depends(get_current_user)
):

    reminders = get_today_reminders(user_id)

    return {
        "count": len(reminders),
        "reminders": reminders
    }