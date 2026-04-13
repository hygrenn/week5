import json
import uuid
from fastapi import APIRouter, Request, HTTPException, Header
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from models.subscription import Subscription
from models.user import User
from services.polar_service import verify_webhook_signature

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/polar")
async def polar_webhook(
    request: Request,
    x_polar_signature: str = Header(None),
    db: Session = Depends(get_db),
):
    payload = await request.body()

    if not x_polar_signature or not verify_webhook_signature(payload, x_polar_signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    data = json.loads(payload)
    event_type = data.get("type")

    if event_type == "subscription.created":
        _handle_subscription_created(data, db)
    elif event_type == "subscription.updated":
        _handle_subscription_updated(data, db)
    elif event_type == "subscription.canceled":
        _handle_subscription_cancelled(data, db)

    return {"ok": True}


def _handle_subscription_created(data: dict, db: Session):
    sub_data = data.get("data", {})
    polar_sub_id = sub_data.get("id")
    customer_email = sub_data.get("customer", {}).get("email")

    if not customer_email:
        return

    user = db.query(User).filter(User.email == customer_email).first()
    if not user:
        return

    subscription = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    if subscription:
        subscription.plan = "premium"
        subscription.status = "active"
        subscription.polar_subscription_id = polar_sub_id
    else:
        subscription = Subscription(
            id=str(uuid.uuid4()),
            user_id=user.id,
            polar_subscription_id=polar_sub_id,
            plan="premium",
            status="active",
        )
        db.add(subscription)
    db.commit()


def _handle_subscription_updated(data: dict, db: Session):
    sub_data = data.get("data", {})
    polar_sub_id = sub_data.get("id")
    status = sub_data.get("status", "active")

    subscription = db.query(Subscription).filter(
        Subscription.polar_subscription_id == polar_sub_id
    ).first()
    if subscription:
        subscription.status = status
        if status != "active":
            subscription.plan = "free"
        db.commit()


def _handle_subscription_cancelled(data: dict, db: Session):
    sub_data = data.get("data", {})
    polar_sub_id = sub_data.get("id")

    subscription = db.query(Subscription).filter(
        Subscription.polar_subscription_id == polar_sub_id
    ).first()
    if subscription:
        subscription.status = "cancelled"
        subscription.plan = "free"
        db.commit()
