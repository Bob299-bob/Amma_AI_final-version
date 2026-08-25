from pydantic import BaseModel
from typing import Optional


class Exercise(BaseModel):
    name: str
    time: str
    duration: Optional[int] = None
    difficulty: Optional[str] = None
    repeat: str = "daily"
    active: bool = True