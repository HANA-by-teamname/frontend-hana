## HANA 프론트엔드

> 하나뿐인 유학생활을 위한 통합 플랫폼  
> **HANA**의 프론트엔드 레포입니다. (`Next.js` 기반)

## 🧭 프로젝트 구조

```

hana\_frontend/
├── hana-second/           # 실제 작업 디렉토리
│   └── hana-client/       # ✅ Next.js 앱
├── crawl/                 # (예전 크롤링 폴더, 사용하지 않음)
├── .venv/                 # Python 가상환경
└── README.md

````

---

## ⚙️ 기술 스택

| 기술 | 설명 |
|------|------|
| **Next.js 14** | App Router 기반 구조 |
| **React** | UI 렌더링 |
| **Tailwind CSS** | 빠른 UI 구성 |
| **TypeScript** | 타입 안정성 |
| **Vercel** (예정) | 배포 예정 플랫폼

---

## 🚀 실행 방법

### 1. 의존성 설치

```bash
cd hana-second/hana-client
npm install
````

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 접속

```
http://localhost:3000
```

---

## 🔐 로그인 / 회원가입 흐름

* `/auth/login`: 이메일 또는 소셜 로그인
* 로그인 실패 시 → 자동 회원가입 시도
* 회원가입 성공 시 → 토큰 저장 및 `/home` 리디렉션

✅ *로그인 시 받은 JWT 토큰은 `localStorage`에 저장됩니다.*

---

## 📁 주요 디렉토리

| 디렉토리            | 설명                                         |
| --------------- | ------------------------------------------ |
| `app/`          | 라우팅 구조 정의 (`/auth`, `/home`, `/chatbot` 등) |
| `lib/api/`      | API 연동 함수 (예: `login()`, `signup()`)       |
| `components/`   | 공통 UI 컴포넌트                                 |
| `hooks/`        | 커스텀 훅                                      |
| `public/icons/` | 하단 탭바용 SVG 아이콘                             |

---

## ✨ TODO

* [ ] 소셜 로그인 연동 (카카오, 구글)
* [ ] 로그인 유지 상태 처리
* [ ] 마이페이지 구현
* [ ] 백엔드 배포 서버 연결 (`.env` 활용)

---

## 🙋‍♀️ 개발자 가이드

* 커밋 메시지는 Conventional Commits 스타일 사용

  ```
  feat(auth): 로그인/회원가입 통합 처리
  fix(chat): 메시지 중복 전송 이슈 해결
  ```

* 환경변수는 `.env.local` 에 다음처럼 설정:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

---

## 🧑‍💻 주요 기여자

| 이름         | 역할                         |
| ---------- | -------------------------- |
| 🧑‍🎨 @이유정 | 프론트엔드 개발 리드 |

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.

```