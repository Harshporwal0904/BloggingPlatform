from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import init_db
from app.routes import auth, posts

app = FastAPI(title="Blogging Platform API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(auth.router)
app.include_router(posts.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Blogging Platform API"}
