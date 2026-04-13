from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubscriptionOut(BaseModel):
    plan: str
    status: str
    current_period_end: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    subscription: Optional[SubscriptionOut] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ModuleProgress(BaseModel):
    module_id: int
    completed: bool
    completed_at: Optional[datetime] = None
