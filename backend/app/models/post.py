from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime

class Post(Document):
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: PydanticObjectId

    class Settings:
        name = "posts"
