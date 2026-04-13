# PRD: AI/ML 딥러닝 학습 플랫폼 (Week 5)

**버전:** 1.0  
**작성일:** 2026-04-08  
**상태:** Draft

---

## 1. 개요

### 1.1 제품 비전

딥러닝 핵심 개념(Regularization, Overfitting/Underfitting, Data Augmentation, Transfer Learning, CNN)을 인터랙티브하게 학습할 수 있는 웹 기반 교육 플랫폼. 사용자는 이론 학습과 함께 실제 실험 결과를 시각적으로 확인하고, 유료 구독을 통해 고급 콘텐츠에 접근한다.

### 1.2 목표

- Google OAuth를 통한 간편 회원가입/로그인으로 진입 장벽 최소화
- Week 5 딥러닝 5개 주제를 구조화된 학습 모듈로 제공
- Polar.sh 결제를 통한 프리미엄 콘텐츠 수익화
- Vercel 배포를 통한 안정적인 서비스 제공

### 1.3 대상 사용자

- AI/ML을 공부하는 학생 및 개발자
- 딥러닝 개념을 시각적으로 이해하고 싶은 사람
- 실무에서 모델 성능 개선 기법을 배우고 싶은 엔지니어

---

## 2. 사용자 여정

### 2.1 신규 사용자

```
랜딩 페이지 방문
→ "Google로 시작하기" 클릭
→ Google OAuth 인증
→ 대시보드 (무료 콘텐츠 접근)
→ 프리미엄 잠금 콘텐츠 발견
→ Polar.sh 결제
→ 전체 콘텐츠 접근
```

### 2.2 재방문 사용자

```
랜딩 페이지 방문
→ Google 로그인
→ 대시보드 (학습 진도 유지)
→ 이어서 학습
```

---

## 3. 기능 요구사항

### 3.1 인증 (Authentication)

| ID | 기능 | 우선순위 |
|----|------|----------|
| AUTH-01 | Google OAuth 2.0 로그인/회원가입 | P0 |
| AUTH-02 | 로그인 상태 유지 (JWT 토큰) | P0 |
| AUTH-03 | 로그아웃 | P0 |
| AUTH-04 | 사용자 프로필 표시 (이름, 이메일, 아바타) | P1 |

### 3.2 콘텐츠 모듈

총 5개 학습 모듈. 각 모듈은 이론 설명 + 코드 예시 + 실험 결과 시각화로 구성.

| ID | 모듈 | 설명 | 접근 권한 |
|----|------|------|-----------|
| MOD-01 | Regularization | L1/L2, Dropout, Batch Normalization 비교 | 무료 |
| MOD-02 | Overfitting vs Underfitting | 모델 복잡도와 성능 관계 | 무료 |
| MOD-03 | Data Augmentation | 이미지 증강 기법 시각화 | 프리미엄 |
| MOD-04 | Transfer Learning | MobileNetV2 구조 및 Fine-tuning | 프리미엄 |
| MOD-05 | MNIST CNN 실습 | CNN 모델 구조 및 학습 결과 | 프리미엄 |

#### 각 모듈 세부 기능

- **MOD-01 Regularization**
  - Validation Loss 비교 차트 (None / L2 / Dropout / Batch Norm)
  - 규제 기법별 개념 설명 카드
  - 코드 스니펫 표시 (syntax highlighting)

- **MOD-02 Overfitting vs Underfitting**
  - 예측 결과 시각화 (Underfit / Balanced / Overfit)
  - Loss Curve 비교 차트
  - 개념 설명 (인터랙티브 슬라이더 - 모델 복잡도 조절 시뮬레이션)

- **MOD-03 Data Augmentation** _(프리미엄)_
  - 원본 이미지 → 증강 이미지 9장 그리드
  - 증강 파라미터 설명 (RandomFlip, RandomRotation, RandomZoom)

- **MOD-04 Transfer Learning** _(프리미엄)_
  - MobileNetV2 아키텍처 다이어그램
  - Feature Extraction vs Fine-tuning 비교 설명
  - 모델 요약 텍스트 표시

- **MOD-05 MNIST CNN** _(프리미엄)_
  - CNN 모델 구조 시각화
  - 학습 정확도 차트 (Train Accuracy / Val Accuracy)
  - 최종 테스트 정확도 표시

### 3.3 결제 (Payment)

| ID | 기능 | 우선순위 |
|----|------|----------|
| PAY-01 | Polar.sh 결제 페이지 연동 | P0 |
| PAY-02 | 구독 상태 확인 및 권한 부여 | P0 |
| PAY-03 | 구독 플랜 선택 UI | P1 |
| PAY-04 | Webhook을 통한 결제 완료 처리 | P0 |

#### 구독 플랜

| 플랜 | 가격 | 접근 가능 콘텐츠 |
|------|------|-----------------|
| Free | 무료 | MOD-01, MOD-02 |
| Premium | $9.99/월 | MOD-01 ~ MOD-05 전체 |

### 3.4 대시보드

| ID | 기능 | 우선순위 |
|----|------|----------|
| DASH-01 | 학습 모듈 목록 및 잠금/해제 상태 표시 | P0 |
| DASH-02 | 학습 진도 표시 (모듈별 완료 여부) | P1 |
| DASH-03 | 구독 상태 배지 표시 | P1 |

---

## 4. 비기능 요구사항

### 4.1 성능

- 페이지 초기 로드 3초 이내 (LCP 기준)
- API 응답시간 200ms 이내 (p95)

### 4.2 보안

- HTTPS 강제 (Vercel 기본 제공)
- JWT 토큰 만료 시간: 24시간
- Refresh Token: 30일
- Polar.sh Webhook 서명 검증 필수

### 4.3 호환성

- 브라우저: Chrome, Safari, Firefox, Edge 최신 버전
- 반응형: 모바일(375px) ~ 데스크탑(1440px)

---

## 5. 페이지 구조 (Sitemap)

```
/                    → 랜딩 페이지
/auth/callback       → Google OAuth 콜백
/dashboard           → 학습 대시보드 (로그인 필요)
/learn/01            → Regularization 모듈
/learn/02            → Overfitting vs Underfitting 모듈
/learn/03            → Data Augmentation 모듈 (프리미엄)
/learn/04            → Transfer Learning 모듈 (프리미엄)
/learn/05            → MNIST CNN 모듈 (프리미엄)
/pricing             → 구독 플랜 페이지
/profile             → 사용자 프로필 (로그인 필요)
```

---

## 6. 성공 지표 (KPI)

| 지표 | 목표 |
|------|------|
| 회원가입 전환율 | 랜딩 페이지 방문자의 30% |
| 무료 → 유료 전환율 | 가입 사용자의 10% |
| 모듈 완료율 | 접근한 사용자의 60% |
| 월간 활성 사용자 (MAU) | 런칭 3개월 내 500명 |

---

## 7. 제외 범위 (Out of Scope)

- 실시간 Python 코드 실행 (서버 사이드 ML 연산)
- 사용자 커스텀 데이터 업로드
- 소셜 기능 (댓글, 포럼)
- 모바일 앱 (iOS/Android)
- 다국어 지원 (한국어 단일 제공)
