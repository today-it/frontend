# Convention

프로젝트의 변경 이력을 일관된 형태로 관리하기 위한 Commit, Branch, Pull Request 규칙입니다.

## Commit Convention

### Commit Message Format

커밋 메시지는 다음 형식으로 작성합니다.

```text
<type>: <subject> #<issue-number>

<body> (optional)

<footer> (optional)
```

### Type

변경 목적에 따라 아래 타입 중 하나를 사용합니다.

| Type | 사용 범위 |
| --- | --- |
| `feat` | 새로운 기능 구현 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷팅, 세미콜론 누락 등 코드 동작 변경이 없는 수정 |
| `refactor` | 코드 리팩터링 |
| `test` | 테스트 코드 추가 또는 수정 |
| `chore` | 빌드 설정, 패키지 매니저, 기타 환경 설정 수정 |
| `comment` | 필요한 주석 추가 또는 수정 |
| `design` | CSS, UI 디자인, 이미지 등 화면 관련 수정 |
| `remove` | 파일 또는 코드 삭제 |
| `rename` | 파일 경로 또는 파일명 변경 |
| `devops` | 배포, CI/CD 및 프로젝트 자동화 관련 |

### Subject

- 50자 이내로 간결하게 작성합니다.
- 무엇을 변경했는지 명확하게 드러냅니다.
- 제목 끝에 마침표를 작성하지 않습니다.
- `구현`, `추가`, `수정`, `분리`, `개선`처럼 작업 내용을 나타내는 표현을 사용합니다.

```text
feat: 사용자 프로필 수정 기능 구현
fix: 중복 요청이 처리되는 오류 수정
refactor: 인증 검증 로직 분리
style: 코드 포맷팅 규칙 적용
design: 로그인 버튼 UI 디자인 수정
```

### Body

제목만으로 변경 내용을 설명하기 어려울 때 작성합니다.

- 무엇을 어떻게 변경했는지 작성합니다.
- 변경한 이유나 설계 의도가 있다면 함께 기록합니다.
- 주요 비즈니스 규칙이나 영향 범위를 필요한 만큼 작성합니다.

```text
feat: 알림 설정 기능 구현

- 사용자별 알림 수신 여부를 저장하도록 구조 추가
- 설정 변경 시 입력값을 검증하도록 처리
- 관련 테스트 케이스 추가
```

### Footer

관련 이슈를 연결하거나 자동으로 종료할 때 사용합니다.

| Keyword | 사용 기준 | 예시 |
| --- | --- | --- |
| `closes` | 일반 작업을 완료한 경우 | `closes #10` |
| `fixes` | 버그를 수정한 경우 | `fixes #25` |
| `resolves` | 논의·설계 이슈를 해결한 경우 | `resolves #40` |

이슈를 종료하지 않고 참조만 할 경우 이슈 번호만 작성합니다.

```text
related: #75
```

## Branch Convention

### Naming Format

```text
{type}/{summary}
```

- 브랜치 이름에는 `#` 문자를 포함하지 않습니다.
- `summary`는 영문 소문자와 하이픈을 사용해 간결하게 작성합니다.
- 작업 브랜치는 최신 develop 브랜치에서 생성합니다.

| Type | 예시 | 용도 |
| --- | --- | --- |
| `feature` | `feature/profile-update` | 새로운 기능 구현 |
| `style` | `style/code-formatting` | 코드 스타일 및 포맷팅 수정 |
| `fix` | `fix/duplicate-request` | 버그(기능) 수정 |
| `refactor` | `refactor/auth-validation` | 리팩토링 |
| `docs` | `docs/readme-update` | README 등 문서 작업 |
| `test` | `test/service-test` | 테스트 코드, 실험, 기타 검증 작업 |
| `design` | `design/login-button` | CSS, UI 디자인, 이미지 등 화면 관련 수정 |

## Pull Request Convention

### PR Title

PR 제목은 이모지와 대표 커밋과 동일한 형식을 사용합니다.

```text
✨ feat: 사용자 프로필 수정 기능 구현
```

PR 제목에 사용하는 이모지는 다음과 같습니다.

| Type | Emoji | Emoji Code | 사용 범위 |
| --- | --- | --- | --- |
| `feat` | ✨ | `:sparkles:` | 새로운 기능 추가 또는 기존 기능 개선 |
| `fix` | 🐛 | `:bug:` | 버그 수정 (서버 오류, 데이터 불일치 등) |
| `docs` | 📚 | `:books:` | 프로젝트 문서 수정 및 추가 (`README.md` 등) |
| `style` | 🧹 | `:broom:` | 코드 포맷팅, 세미콜론 누락 등 기능과 무관한 스타일 수정 |
| `design` | 🎨 | `:art:` | CSS, UI 디자인, 이미지 등 화면 관련 수정 |
| `refactor` | 🛠 | `:hammer_and_wrench:` | 기존 코드 및 아키텍처 개선 (리팩토링) |
| `test` | 🧪 | `:test_tube:` | 유닛 테스트, 통합 테스트 코드 추가 및 수정 |
| `chore` | ⚙️ | `:gear:` | 개발 환경 구축 및 설정 변경 사항 (빌드, 의존성 업데이트 등) |
| `devops` | 🐳 | `:whale:` | 배포, CI/CD 및 프로젝트 자동화 관련 |

### PR Body

저장소의 `.github/pull_request_template.md`를 사용합니다.

PR에는 최소한 다음 내용을 포함합니다.

- 작업 내용
- 관련 이슈
- 테스트 및 자체 검토 여부
- 리뷰어가 알아야 할 추가 사항

관련 이슈를 자동 종료하려면 다음 키워드를 사용합니다.

```text
closes #10
fixes #25
resolves #40
```

진행 중인 이슈를 단순 참조할 때는 자동 종료 키워드 없이 이슈 번호를 연결합니다.
