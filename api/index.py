import sys
import os

# Vercel 서버리스 환경에서 현재 디렉토리를 경로에 추가
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from database import init_db
from routers import auth, users, webhooks
from dependencies import get_current_user
from models.user import User
from services.polar_service import create_checkout_session
from config import settings

app = FastAPI(title="딥러닝 학습 플랫폼 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(webhooks.router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/checkout")
async def checkout(current_user: User = Depends(get_current_user)):
    success_url = f"{settings.frontend_url}/dashboard?payment=success"
    url = await create_checkout_session(current_user.email, success_url)
    return {"checkout_url": url}


# Vercel 서버리스 핸들러
handler = Mangum(app, lifespan="off")
