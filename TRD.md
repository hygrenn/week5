# TRD: AI/ML 딥러닝 학습 플랫폼 (Week 5)

**버전:** 1.0  
**작성일:** 2026-04-08  
**상태:** Draft

---

## 1. 시스템 아키텍처

### 1.1 전체 구성도

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel (CDN)                          │
│                                                              │
│   ┌──────────────────────────────────┐                      │
│   │     Frontend (React + Vite)       │                      │
│   │     Tailwind CSS                  │                      │
│   │     /src/...                      │                      │
│   └──────────────────────────────────┘                      │
│                        │                                     │
│   ┌──────────────────────────────────┐                      │
│   │   Backend (FastAPI)               │                      │
│   │   Vercel Serverless Functions     │                      │
│   │   /api/...                        │                      │
│   └──────────────────────────────────┘                      │
│                        │                                     │
│   ┌──────────────────────────────────┐                      │
│   │   SQLite (Vercel KV or PlanetScale│                      │
│   │   개발: SQLite / 운영: Turso)      │                      │
│   └──────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
         │                              │
┌────────────────┐            ┌──────────────────┐
│  Google OAuth   │            │    Polar.sh       │
│  (인증/회원가입) │            │  (결제/구독 관리)  │
└────────────────┘            └──────────────────┘
```

> **Note:** Vercel은 serverless 환경으로 파일시스템 SQLite를 영구 저장할 수 없습니다.  
> - **개발 환경:** SQLite 파일 (`./data/app.db`)  
> - **운영 환경:** [Turso](https://turso.tech/) (libSQL - SQLite 호환 분산 DB, 무료 티어 존재) 또는 Vercel Postgres

---

## 2. 기술 스택

### 2.1 Frontend

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | React | 18.x |
| 번들러 | Vite | 5.x |
| CSS | Tailwind CSS | 3.x |
| 라우팅 | React Router | 6.x |
| 상태 관리 | Zustand | 4.x |
| HTTP 클라이언트 | Axios | 1.x |
| 차트 | Recharts | 2.x |
| 코드 하이라이팅 | Prism.js (react-syntax-highlighter) | - |
| 아이콘 | Heroicons / lucide-react | - |

### 2.2 Backend

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | FastAPI | 0.115.x |
| ASGI 서버 | Uvicorn | 0.32.x |
| ORM | SQLAlchemy | 2.x |
| DB 드라이버 | aiosqlite (개발) / libsql-client (운영) | - |
| 인증 | python-jose (JWT) | 3.x |
| OAuth 클라이언트 | httpx | 0.27.x |
| 환경변수 | python-dotenv | 1.x |
| 유효성 검사 | Pydantic v2 | - |
| Vercel 서버리스 | mangum | 0.17.x |

### 2.3 인프라 / 외부 서비스

| 항목 | 서비스 |
|------|--------|
| 배포 | Vercel |
| DB (운영) | Turso (libSQL) |
| 인증 | Google OAuth 2.0 |
| 결제 | Polar.sh |

---

## 3. 디렉토리 구조

```
week5-platform/
├── frontend/                    # React 앱
│   ├── public/
│   │   └── images/              # 실험 결과 이미지 (정적 자산)
│   │       ├── 01_regularization_plot.png
│   │       ├── 02_overfitting_underfitting.png
│   │       ├── 03_augmentation_examples.png
│   │       └── 05_mnist_cnn_result.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── auth/
│   │   │   │   └── GoogleLoginButton.jsx
│   │   │   ├── learn/
│   │   │   │   ├── ModuleCard.jsx      # 모듈 목록 카드
│   │   │   │   ├── LockOverlay.jsx     # 프리미엄 잠금 UI
│   │   │   │   ├── CodeBlock.jsx       # 코드 스니펫
│   │   │   │   └── ResultChart.jsx     # Recharts 래퍼
│   │   │   └── pricing/
│   │   │       └── PricingCard.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AuthCallback.jsx        # Google OAuth 콜백
│   │   │   ├── Pricing.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── learn/
│   │   │       ├── Module01.jsx        # Regularization
│   │   │       ├── Module02.jsx        # Overfitting
│   │   │       ├── Module03.jsx        # Data Augmentation
│   │   │       ├── Module04.jsx        # Transfer Learning
│   │   │       └── Module05.jsx        # MNIST CNN
│   │   ├── store/
│   │   │   └── authStore.js            # Zustand - 인증 상태
│   │   ├── lib/
│   │   │   ├── api.js                  # Axios 인스턴스 + interceptor
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # FastAPI 앱
│   ├── app/
│   │   ├── main.py              # FastAPI 앱 진입점
│   │   ├── config.py            # 환경변수 설정
│   │   ├── database.py          # DB 연결 설정
│   │   ├── models/
│   │   │   ├── user.py          # SQLAlchemy User 모델
│   │   │   └── subscription.py  # SQLAlchemy Subscription 모델
│   │   ├── schemas/
│   │   │   ├── user.py          # Pydantic 스키마
│   │   │   └── subscription.py
│   │   ├── routers/
│   │   │   ├── auth.py          # /auth/* 엔드포인트
│   │   │   ├── users.py         # /users/* 엔드포인트
│   │   │   └── webhooks.py      # /webhooks/* (Polar.sh)
│   │   ├── services/
│   │   │   ├── google_oauth.py  # Google OAuth 로직
│   │   │   ├── jwt_service.py   # JWT 생성/검증
│   │   │   └── polar_service.py # Polar.sh Webhook 처리
│   │   └── dependencies.py      # FastAPI Depends (인증 미들웨어)
│   ├── requirements.txt
│   └── .env.example
│
├── vercel.json                  # Vercel 배포 설정
└── README.md
```

---

## 4. 데이터베이스 스키마

### 4.1 users 테이블

```sql
CREATE TABLE users (
    id          TEXT PRIMARY KEY,          -- UUID
    email       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    avatar_url  TEXT,
    google_id   TEXT UNIQUE NOT NULL,      -- Google sub (고유 ID)
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 subscriptions 테이블

```sql
CREATE TABLE subscriptions (
    id                  TEXT PRIMARY KEY,   -- UUID
    user_id             TEXT NOT NULL REFERENCES users(id),
    polar_subscription_id TEXT UNIQUE,      -- Polar.sh 구독 ID
    plan                TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'premium'
    status              TEXT NOT NULL DEFAULT 'active', -- 'active' | 'cancelled' | 'expired'
    current_period_end  DATETIME,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 module_progress 테이블

```sql
CREATE TABLE module_progress (
    id          TEXT PRIMARY KEY,   -- UUID
    user_id     TEXT NOT NULL REFERENCES users(id),
    module_id   INTEGER NOT NULL,   -- 1~5
    completed   BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    UNIQUE(user_id, module_id)
);
```

---

## 5. API 설계

### 5.1 Base URL

- 개발: `http://localhost:8000`
- 운영: `https://<your-domain>.vercel.app/api`

### 5.2 인증 API

#### `GET /api/auth/google`
Google OAuth 인증 URL로 리다이렉트

**Response:** `302 Redirect → Google OAuth URL`

---

#### `GET /api/auth/callback`
Google OAuth 콜백 처리 및 JWT 발급

**Query Params:**
```
code: string   (Google 인가 코드)
state: string  (CSRF 방지 state)
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "name": "홍길동",
    "avatar_url": "https://..."
  }
}
```

---

#### `POST /api/auth/logout`
로그아웃 (클라이언트 토큰 무효화 안내)

**Headers:** `Authorization: Bearer <token>`  
**Response:** `204 No Content`

---

### 5.3 사용자 API

#### `GET /api/users/me`
현재 로그인된 사용자 정보 조회

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "name": "홍길동",
  "avatar_url": "https://...",
  "subscription": {
    "plan": "premium",
    "status": "active",
    "current_period_end": "2026-05-08T00:00:00Z"
  }
}
```

---

#### `GET /api/users/me/progress`
사용자 학습 진도 조회

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "progress": [
    { "module_id": 1, "completed": true, "completed_at": "2026-04-01T10:00:00Z" },
    { "module_id": 2, "completed": false, "completed_at": null },
    { "module_id": 3, "completed": false, "completed_at": null },
    { "module_id": 4, "completed": false, "completed_at": null },
    { "module_id": 5, "completed": false, "completed_at": null }
  ]
}
```

---

#### `POST /api/users/me/progress/{module_id}/complete`
모듈 완료 처리

**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "module_id": 1,
  "completed": true,
  "completed_at": "2026-04-08T12:00:00Z"
}
```

---

### 5.4 결제 API

#### `POST /api/checkout`
Polar.sh 결제 세션 생성

**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "plan": "premium"
}
```

**Response:**
```json
{
  "checkout_url": "https://polar.sh/checkout/..."
}
```

---

#### `POST /api/webhooks/polar`
Polar.sh Webhook 수신 (서명 검증 필수)

**Headers:** `X-Polar-Signature: <hmac_sha256>`  
**Request Body:** Polar.sh Webhook Payload

처리 이벤트:
- `subscription.created` → 구독 생성, plan을 'premium'으로 업데이트
- `subscription.updated` → 구독 상태 업데이트
- `subscription.cancelled` → 구독 취소, plan을 'free'로 변경

**Response:** `200 OK`

---

### 5.5 에러 응답 형식

```json
{
  "detail": "에러 메시지",
  "code": "ERROR_CODE"
}
```

| HTTP 코드 | 코드 | 의미 |
|-----------|------|------|
| 401 | `UNAUTHORIZED` | 인증 토큰 없음/만료 |
| 403 | `FORBIDDEN` | 권한 없음 (프리미엄 콘텐츠) |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 422 | `VALIDATION_ERROR` | 요청 파라미터 오류 |

---

## 6. 인증 플로우

### 6.1 Google OAuth 2.0 플로우

```
Frontend                Backend              Google
   │                       │                    │
   │ 1. "Google로 로그인" 클릭│                    │
   │──────────────────────►│                    │
   │                       │ 2. OAuth URL 생성   │
   │◄──────────────────────│ (state, redirect)   │
   │                       │                    │
   │ 3. Google 로그인 페이지로 리다이렉트           │
   │───────────────────────────────────────────►│
   │                       │                    │
   │ 4. 사용자 인증 완료                          │
   │◄───────────────────────────────────────────│
   │ (code, state 포함 콜백 URL)                 │
   │                       │                    │
   │ 5. /api/auth/callback?code=...              │
   │──────────────────────►│                    │
   │                       │ 6. code로 토큰 교환  │
   │                       │───────────────────►│
   │                       │◄───────────────────│
   │                       │ (access_token)      │
   │                       │                    │
   │                       │ 7. 사용자 정보 조회  │
   │                       │───────────────────►│
   │                       │◄───────────────────│
   │                       │ (email, name, sub)  │
   │                       │                    │
   │                       │ 8. DB upsert User   │
   │                       │ 9. JWT 생성          │
   │◄──────────────────────│                    │
   │ (JWT access_token)    │                    │
```

### 6.2 JWT 구조

```python
# Payload
{
    "sub": "user-uuid",
    "email": "user@gmail.com",
    "exp": 1234567890,  # 24시간 후
    "iat": 1234567890
}
```

### 6.3 프론트엔드 토큰 저장

- `localStorage`에 `access_token` 저장
- Axios 인터셉터에서 모든 요청에 `Authorization: Bearer <token>` 자동 첨부
- 401 응답 시 토큰 삭제 후 랜딩 페이지로 리다이렉트

---

## 7. Polar.sh 결제 연동

### 7.1 설정 순서

1. [polar.sh](https://polar.sh) 에서 Organization 생성
2. Product 생성: "Premium Plan" ($9.99/월 구독)
3. Webhook 등록: `https://<your-domain>/api/webhooks/polar`
4. Webhook Secret 발급 → `.env`에 저장

### 7.2 결제 플로우

```
Frontend          Backend            Polar.sh
   │                 │                   │
   │ 1. 결제하기 클릭  │                   │
   │────────────────►│                   │
   │                 │ 2. Checkout 세션 생성
   │                 │──────────────────►│
   │                 │◄──────────────────│
   │                 │ (checkout_url)    │
   │◄────────────────│                   │
   │ 3. Polar.sh 결제 페이지로 이동        │
   │──────────────────────────────────► │
   │                 │                   │
   │                 │ 4. Webhook POST    │
   │                 │◄──────────────────│
   │                 │ subscription.created
   │                 │                   │
   │                 │ 5. DB 구독 업데이트 │
   │                 │ (plan: premium)   │
   │ 6. 결제 완료 후 리다이렉트           │
   │◄──────────────────────────────────  │
   │ (success_url=/dashboard)            │
```

### 7.3 Webhook 서명 검증 코드

```python
import hmac
import hashlib

def verify_polar_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## 8. 권한 검사 (Authorization)

### 8.1 모듈 접근 권한 매핑

```python
MODULE_PERMISSIONS = {
    1: "free",     # Regularization
    2: "free",     # Overfitting vs Underfitting
    3: "premium",  # Data Augmentation
    4: "premium",  # Transfer Learning
    5: "premium",  # MNIST CNN
}
```

### 8.2 FastAPI Dependency

```python
async def require_premium(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    subscription = await get_user_subscription(db, current_user.id)
    if subscription.plan != "premium" or subscription.status != "active":
        raise HTTPException(status_code=403, detail="Premium subscription required")
    return current_user
```

### 8.3 Frontend 가드

```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ children, requirePremium = false }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" />;
  if (requirePremium && user.subscription.plan !== 'premium') {
    return <PremiumUpgradePrompt />;
  }
  return children;
};
```

---

## 9. Vercel 배포 설정

### 9.1 `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/app/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "GOOGLE_CLIENT_ID": "@google_client_id",
    "GOOGLE_CLIENT_SECRET": "@google_client_secret",
    "JWT_SECRET_KEY": "@jwt_secret_key",
    "POLAR_WEBHOOK_SECRET": "@polar_webhook_secret",
    "POLAR_ACCESS_TOKEN": "@polar_access_token",
    "DATABASE_URL": "@database_url",
    "FRONTEND_URL": "@frontend_url"
  }
}
```

### 9.2 환경변수 목록

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | OAuth 콜백 URL | `https://your-domain.vercel.app/api/auth/callback` |
| `JWT_SECRET_KEY` | JWT 서명 키 (랜덤 256비트) | `openssl rand -hex 32` |
| `JWT_ALGORITHM` | JWT 알고리즘 | `HS256` |
| `POLAR_ACCESS_TOKEN` | Polar.sh API 토큰 | `polar_...` |
| `POLAR_WEBHOOK_SECRET` | Polar.sh Webhook 시크릿 | `whsec_...` |
| `POLAR_PRODUCT_ID` | Polar.sh 상품 ID | `prod_...` |
| `DATABASE_URL` | DB 연결 문자열 | `libsql://xxx.turso.io?authToken=yyy` |
| `FRONTEND_URL` | 프론트엔드 URL | `https://your-domain.vercel.app` |

### 9.3 배포 절차

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 링크
vercel link

# 3. 환경변수 설정
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
# ... (나머지 환경변수)

# 4. 배포
vercel --prod
```

---

## 10. 개발 환경 설정

### 10.1 Frontend 로컬 실행

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 10.2 Backend 로컬 실행

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# .env 파일 생성 (.env.example 복사 후 값 입력)
cp .env.example .env

# DB 초기화
python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"

# 서버 실행
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
```

### 10.3 로컬 Webhook 테스트

Polar.sh Webhook을 로컬에서 테스트하려면 ngrok 사용:

```bash
ngrok http 8000
# 생성된 URL을 Polar.sh Webhook URL로 등록
# ex) https://xxxx.ngrok.io/api/webhooks/polar
```

---

## 11. 보안 체크리스트

- [ ] Google OAuth state 파라미터로 CSRF 방지
- [ ] JWT 서명 검증 (HS256)
- [ ] Polar.sh Webhook HMAC 서명 검증
- [ ] CORS 설정 (프론트엔드 도메인만 허용)
- [ ] SQL Injection 방지 (SQLAlchemy ORM 사용)
- [ ] XSS 방지 (React 기본 이스케이핑)
- [ ] 민감한 환경변수 Vercel Secret으로 관리
- [ ] HTTPS 강제 (Vercel 기본)
- [ ] Rate Limiting (FastAPI SlowAPI 또는 Vercel Edge 설정)

---

## 12. 구현 순서 (개발 로드맵)

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 1 | 프로젝트 초기화 (Vite + FastAPI 보일러플레이트) | 실행 가능한 Hello World |
| 2 | DB 스키마 및 SQLAlchemy 모델 작성 | DB 초기화 스크립트 |
| 3 | Google OAuth 연동 (백엔드) | `/api/auth/google`, `/api/auth/callback` |
| 4 | JWT 인증 미들웨어 | `get_current_user` Dependency |
| 5 | 프론트엔드 인증 UI (랜딩, 로그인 버튼, 콜백 처리) | 로그인 동작 |
| 6 | 학습 모듈 페이지 (01, 02 무료) | 콘텐츠 렌더링 |
| 7 | Polar.sh 결제 연동 | Checkout 플로우 |
| 8 | Webhook 처리 및 구독 상태 관리 | 자동 권한 부여 |
| 9 | 학습 모듈 페이지 (03, 04, 05 프리미엄) + 잠금 UI | 완성된 콘텐츠 |
| 10 | Vercel 배포 + Turso DB 연결 | 라이브 URL |
| 11 | 테스트 및 버그 수정 | 안정적인 서비스 |
