아래는 **HANA Frontend** 기여자들을 위한 가이드 문서입니다. 기존 백엔드 버전의 톤과 구성은 유지하면서, 프론트엔드 특성에 맞게 수정했습니다:

---

# Contributing to HANA Frontend

환영합니다! 🎉
HANA 프론트엔드 프로젝트에 기여해주셔서 감사합니다.
아래 가이드라인을 참고하여 자유롭게 이슈 제기, 버그 수정, 기능 추가, UI 개선 등에 참여해 주세요.

---

## 📝 이슈 등록

* UI/UX 개선, 컴포넌트 버그, 기능 제안 등은 [Issues](https://github.com/HANA-by-teamname/frontend-hana/issues) 탭에 등록해 주세요.
* 최대한 명확하게 재현 방법, 기대 동작, 실제 동작을 작성해 주세요.
* [bug\_report.md](/.github/ISSUE_TEMPLATE/bug_report.md)와 [feature\_request.md](/.github/ISSUE_TEMPLATE/feature_request.md) 템플릿을 참고해 주세요.

---

## 🌱 Pull Request(PR) 기여 방법

1. **Fork & Clone**

   * 본인 계정으로 fork한 뒤, 로컬에 clone해 주세요.

2. **새 브랜치 생성**

   * 기능/버그별로 브랜치를 분리해 작업해 주세요.
   * 예시:
     `git checkout -b feat/navbar-animation`
     `git checkout -b fix/responsive-login`

3. **커밋 메시지 규칙**

   * [Git Commit Message Convention](https://purrfect-whip-47f.notion.site/Git-Commit-Message-Convention-1d56d4b96cc48011a5c8f2df0cf4dc37)을 지켜주세요.
   * 예시:

     ```
     feat: 반응형 로그인 페이지 구현
     fix: FooterNav 컴포넌트 아이콘 경로 수정
     style: Pretendard 폰트 적용
     ```

4. **코드 작성 및 테스트**

   * 변경 사항이 기존 컴포넌트나 레이아웃에 영향을 주지 않는지 충분히 테스트해 주세요.
   * 다양한 화면 크기(iPhone 15 Pro 기준 등)에서 레이아웃이 깨지지 않는지 확인해 주세요.

5. **PR 생성**

   * PR 제목과 설명을 명확하게 작성해 주세요.
   * 관련 이슈가 있다면 `Ref #이슈번호`를 본문에 포함해 주세요.
   * 해결된 이슈가 있다면 `Closes #이슈번호` 또는 `Fixes #이슈번호`를 작성해 주세요.
     (PR이 merge되면 해당 이슈가 자동으로 닫힙니다.)

---

## 💅 코드 스타일

* **들여쓰기는 2칸(스페이스)** 으로 통일해 주세요.
* 코드 포맷팅은 [Prettier](https://prettier.io/) 사용을 권장합니다.

  * VSCode의 Prettier 확장을 활용하면 자동 정렬이 편리합니다.
* **컴포넌트 구조는 Atomic Design** 원칙을 따릅니다 (`components/ui`, `components/shared`, `features/` 등).
* **Tailwind CSS**를 사용하므로 클래스 순서 및 중복을 주의해 주세요.
* 불필요한 `console.log`, 주석, 사용되지 않는 import는 PR 전에 정리해 주세요.

---

감사합니다!
우리 함께 더 나은 HANA 프론트를 만들어가요 🚀