from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.models.user import User
from app.auth.security import get_password_hash, verify_password
from app.auth.jwt import create_access_token
from typing import Dict

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    existing_user = await User.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
    hashed_password = get_password_hash(user.password)
    
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    await new_user.insert()
    
    return UserResponse(
        id=str(new_user.id),
        username=new_user.username,
        email=new_user.email,
        created_at=new_user.created_at
    )

@router.post("/login")
async def login_user(user_credentials: UserLogin) -> Dict[str, str]:
    user = await User.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(status_code=403, detail="Invalid credentials")
        
    if not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=403, detail="Invalid credentials")
        
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}
