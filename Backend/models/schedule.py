from pydantic import BaseModel
from typing import Optional


class Schedule(BaseModel):
    title: str
    time: str
    category: Optional[str] = None
    repeat: str = "daily"
    active: bool = True