# Labels

프로젝트에서 사용하는 작업 분류용 GitHub Label 정책입니다.

| Label         | 설명                                                        |
| ------------- | ----------------------------------------------------------- |
| `🛠 refactor`  | 기존 코드 및 아키텍처 개선                                  |
| `⚙️ chore`    | 개발 환경 구축 및 설정 변경 사항 (빌드, 의존성 업데이트 등) |
| `✨ feature`  | 새 기능 혹은 요구 사항                                      |
| `🧹 style`    | 코드 포맷팅, 세미콜론 누락 등 기능과 무관한 스타일 수정     |
| `🎨 design`   | CSS, UI 디자인, 이미지 등 화면 관련 수정                    |
| `🐛 fix`      | 서버 오류, 코드 오류, 데이터 불일치                         |
| `🐳 devops`   | 배포, CI/CD 및 프로젝트 자동화                              |
| `📚 docs`     | 프로젝트 문서 수정 및 추가                                  |
| `🔒 security` | 보안 관련 작업                                              |
| `🧪 test`     | 유닛 테스트, 통합 테스트 코드                               |

## Label 초기화

GitHub Template Repository로 새 저장소를 생성해도 저장소의 Label 자체는 복사되지 않습니다.
따라서 템플릿으로 저장소를 만든 뒤 한 번만 Label 초기화 스크립트를 실행합니다.

### macOS / Linux / Git Bash

```bash
./scripts/setup-labels.sh
```

### Windows PowerShell

```powershell
.\scripts\setup-labels.ps1
```

두 스크립트 모두 새 저장소에 기본으로 생성되는 GitHub 기본 Label을 정리한 뒤 위 Label을 생성합니다. 동일한 이름의 Label이 이미 있으면 색상과 설명을 현재 정책으로 갱신합니다.

> 스크립트 실행 전 GitHub CLI(`gh`) 설치 및 `gh auth login` 인증이 필요합니다.
