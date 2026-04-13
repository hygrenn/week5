import uuid
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.subscription import Subscription
from services.google_oauth import get_google_auth_url, generate_state, exchange_code_for_token, get_google_userinfo
from services.jwt_service import create_access_token
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

# 간단한 state 저장 (프로덕션에서는 Redis 등 사용)
_state_store: set = set()


@router.get("/google")
async def google_login():
    state = generate_state()
    _state_store.add(state)
    url = get_google_auth_url(state)
    return RedirectResponse(url)


@router.get("/callback")
async def google_callback(code: str, state: str, db: Session = Depends(get_db)):
    if state not in _state_store:
        raise HTTPException(status_code=400, detail="유효하지 않은 state 파라미터입니다.")
    _state_store.discard(state)

    # Google 토큰 교환
    try:
        token_data = await exchange_code_for_token(code)
        userinfo = await get_google_userinfo(token_data["access_token"])
    except Exception:
        raise HTTPException(status_code=400, detail="Google 인증에 실패했습니다.")

    google_id = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("name", email.split("@")[0])
    avatar_url = userinfo.get("picture")

    # DB upsert
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            google_id=google_id,
            email=email,
            name=name,
            avatar_url=avatar_url,
        )
        db.add(user)
        db.flush()

        subscription = Subscription(
            id=str(uuid.uuid4()),
            user_id=user.id,
            plan="free",
            status="active",
        )
        db.add(subscription)
    else:
        user.name = name
        user.avatar_url = avatar_url

    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)
    redirect_url = f"{settings.frontend_url}/auth/callback?token={token}"
    return RedirectResponse(redirect_url)


@router.post("/logout", status_code=204)
async def logout():
    # JWT는 stateless이므로 클라이언트에서 토큰 삭제
    return None
