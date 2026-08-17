# Workflow

이 문서는 Issue부터 Merge까지의 기본 협업 흐름을 정의합니다.

## 기본 흐름

```text
Issue 생성
   ↓
Branch 생성
   ↓
개발 및 Commit
   ↓
Pull Request 생성
   ↓
Review / Test
   ↓
Merge
   ↓
Branch 삭제
```

## 1. Issue 생성

모든 작업은 가능한 한 Issue를 기준으로 시작합니다.

작업 목적에 맞는 Issue Form을 선택하고 다음 내용을 명확하게 작성합니다.

- 작업 목적 또는 문제 상황
- 필요한 변경 사항
- 세부 작업 목록
- 완료 조건

## 2. Branch 생성

최신 develop 브랜치를 기준으로 feature 브랜치를 생성합니다.

```bash
git switch develop
git pull origin develop
git switch -c feature/profile-update
```

브랜치 이름은 [Convention](CONVENTION.md)의 Branch Convention을 따릅니다.

## 3. 개발 및 Commit

Issue의 작업 범위를 기준으로 구현하고 의미 있는 작업 단위로 Commit합니다.

```text
feat: 프로필 수정 기능 구현 #1
test: 프로필 수정 서비스 테스트 추가 #1
```

Commit Message는 [Convention](CONVENTION.md)의 Commit Convention을 따릅니다.

## 4. Pull Request 생성

작업이 완료되면 develop 브랜치를 대상으로 Pull Request를 생성합니다.

- PR 제목은 [Convention](CONVENTION.md)의 PR Title 규칙(이모지 포함)을 따릅니다.
  ```text
  ✨ feat: 사용자 프로필 수정 기능 구현
  ```
- PR Template의 항목을 작성합니다.
- 관련 Issue를 연결합니다.
- 주요 변경 사항과 리뷰 포인트를 작성합니다.
- 필요한 테스트가 통과했는지 확인합니다.

## 5. Review / Test

Merge 전에 다음 사항을 확인합니다.

- 요구사항이 충족되었는지 확인합니다.
- 기존 기능에 예상하지 못한 영향이 없는지 확인합니다.
- 필요한 테스트가 통과했는지 확인합니다.
- 리뷰 의견이 있다면 반영하거나 논의합니다.

## 6. Merge

리뷰와 테스트가 완료되면 프로젝트의 Merge 정책에 따라 병합합니다.

Merge 방식은 'Squash and Merge' 방식을 사용합니다.

## 7. Branch 삭제

병합이 끝난 작업 브랜치는 삭제하여 불필요한 브랜치가 남지 않도록 관리합니다.