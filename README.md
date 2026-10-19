# GitHub Collaboration Template

GitHub 기반 팀 프로젝트에서 반복적으로 사용하는 Issue, Pull Request 및 Git 협업 규칙을 관리하기 위한 템플릿입니다.

## 제공 항목

- GitHub Issue Forms
- Pull Request Template
- GitHub Label 초기화 스크립트
- Commit & Branch Convention
- GitHub Workflow

## 문서

프로젝트에서 사용하는 협업 정책은 `docs/`에서 확인할 수 있습니다.

- [Convention](docs/CONVENTION.md)
- [Workflow](docs/WORKFLOW.md)
- [Labels](docs/LABELS.md)

## 로컬 API 설정

프로젝트 루트의 `.env.local`에 백엔드 서버 주소를 설정합니다.

```dotenv
NEXT_PUBLIC_API_BASE_URL=<백엔드 서버 주소>
```

`.env.local`은 Git에서 제외됩니다. `NEXT_PUBLIC_` 값은 브라우저에 공개되며, 변경 후 개발 서버 재시작 또는 재빌드가 필요합니다.
