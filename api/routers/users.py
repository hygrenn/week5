from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.user import UserOut, ModuleProgress

router = APIRouter(prefix="/api/users", tags=["users"])

# V1: 진도는 메모리에 저장 (이후 DB 마이그레이션)
_progress_store: dict = {}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/progress")
def get_progress(current_user: User = Depends(get_current_user)):
    user_progress = _progress_store.get(current_user.id, {})
    progress = []
    for module_id in range(1, 6):
        entry = user_progress.get(module_id, {})
        progress.append(ModuleProgress(
            module_id=module_id,
            completed=entry.get("completed", False),
            completed_at=entry.get("completed_at"),
        ))
    return {"progress": progress}


@router.post("/me/progress/{module_id}/complete", response_model=ModuleProgress)
def complete_module(
    module_id: int,
    current_user: User = Depends(get_current_user),
):
    from datetime import datetime
    if current_user.id not in _progress_store:
        _progress_store[current_user.id] = {}
    _progress_store[current_user.id][module_id] = {
        "completed": True,
        "completed_at": datetime.utcnow(),
    }
    return ModuleProgress(
        module_id=module_id,
        completed=True,
        completed_at=_progress_store[current_user.id][module_id]["completed_at"],
    )
