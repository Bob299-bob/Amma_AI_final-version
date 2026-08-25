from pydantic import BaseModel
from typing import Optional, List


class Medicine(BaseModel):
    medicine_name: str
    dose: Optional[str] = None
    time: str
    before_after_food: Optional[str] = None
    days: List[str] = []
    active: bool = True