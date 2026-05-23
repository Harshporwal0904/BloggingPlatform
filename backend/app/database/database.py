from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.models.post import Post
from app.utils.config import MONGO_URL

async def init_db():
    client = AsyncIOMotorClient(MONGO_URL)
    db_name = MONGO_URL.split("/")[-1].split("?")[0]
    if not db_name:
        db_name = "blogging_platform"
    
    await init_beanie(database=client[db_name], document_models=[User, Post])
