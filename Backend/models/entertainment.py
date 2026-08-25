from pydantic import BaseModel
from typing import Optional


class Entertainment(BaseModel):
    category: str
    title: str
    description: Optional[str] = ""
    language: str = "Hindi"
    url: Optional[str] = ""
    image: Optional[str] = ""
    active: bool = True