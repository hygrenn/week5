import hmac
import hashlib
import httpx
from config import settings

POLAR_API_BASE = "https://api.polar.sh"


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    expected = hmac.new(
        settings.polar_webhook_secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)


async def create_checkout_session(user_email: str, success_url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{POLAR_API_BASE}/v1/checkouts/custom/",
            headers={
                "Authorization": f"Bearer {settings.polar_access_token}",
                "Content-Type": "application/json",
            },
            json={
                "product_id": settings.polar_product_id,
                "success_url": success_url,
                "customer_email": user_email,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["url"]
