from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.models.post import Post
from app.models.user import User
from app.auth.jwt import get_current_user
from typing import List
from beanie import PydanticObjectId
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("", response_model=PostResponse)
async def create_post(post: PostCreate, current_user: User = Depends(get_current_user)):
    new_post = Post(
        title=post.title,
        content=post.content,
        user_id=current_user.id
    )
    await new_post.insert()
    
    return PostResponse(
        id=str(new_post.id),
        title=new_post.title,
        content=new_post.content,
        created_at=new_post.created_at,
        updated_at=new_post.updated_at,
        user_id=str(new_post.user_id)
    )

@router.get("", response_model=List[dict])
async def get_all_posts():
    posts = await Post.find_all().to_list()
    result = []
    for post in posts:
        try:
            author = await User.get(post.user_id)
            author_name = author.username if author else "Unknown"
        except Exception:
            author_name = "Unknown"
            
        result.append({
            "id": str(post.id),
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at,
            "author": author_name
        })
    return result

@router.get("/my-posts", response_model=List[PostResponse])
async def get_my_posts(current_user: User = Depends(get_current_user)):
    posts = await Post.find({"user_id": current_user.id}).to_list()
    return [
        PostResponse(
            id=str(post.id),
            title=post.title,
            content=post.content,
            created_at=post.created_at,
            updated_at=post.updated_at,
            user_id=str(post.user_id)
        ) for post in posts
    ]

@router.get("/{id}", response_model=PostResponse)
async def get_post(id: str):
    try:
        post = await Post.get(PydanticObjectId(id))
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return PostResponse(
            id=str(post.id),
            title=post.title,
            content=post.content,
            created_at=post.created_at,
            updated_at=post.updated_at,
            user_id=str(post.user_id)
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID format")

@router.put("/{id}", response_model=PostResponse)
async def update_post(id: str, post_update: PostUpdate, current_user: User = Depends(get_current_user)):
    try:
        post = await Post.get(PydanticObjectId(id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID format")
        
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")
        
    if post_update.title is not None:
        post.title = post_update.title
    if post_update.content is not None:
        post.content = post_update.content
        
    post.updated_at = datetime.utcnow()
    await post.save()
    
    return PostResponse(
        id=str(post.id),
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        updated_at=post.updated_at,
        user_id=str(post.user_id)
    )

@router.delete("/{id}")
async def delete_post(id: str, current_user: User = Depends(get_current_user)):
    try:
        post = await Post.get(ObjectId(id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID format")
        
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
        
    await post.delete()
    return {"message": "Post deleted successfully"}
