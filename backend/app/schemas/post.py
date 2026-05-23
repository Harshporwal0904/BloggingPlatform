from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PostCreate(BaseModel):
    title: str
    content: str

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    user_id: str

    class Config:
        from_attributes = True
