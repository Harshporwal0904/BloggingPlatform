from beanie import Document
from pydantic import Field
from datetime import datetime

class User(Document):
    username: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
