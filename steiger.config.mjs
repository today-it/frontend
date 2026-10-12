import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  fsd.plugin,
  {
    rules: {
      // 상위 레이어 참조 및 동일 레이어 내 슬라이스 간 교차 참조(cross-import) 금지
      'fsd/forbidden-imports': 'error',
      // 슬라이스 내부 파일 직접 참조 금지 (반드시 index.ts 등 Public API를 통해서만 import)
      'fsd/no-public-api-sidestep': 'error',
      // 동일 슬라이스 내부는 상대 경로, 외부 슬라이스/레이어 참조는 절대 경로(@/...) 사용 강제
      'fsd/import-locality': 'error',
    },
  },
  {
    // app과 shared 레이어는 슬라이스 구분이 없으므로 내부에서 상대 경로 및 절대 경로(@/...) 모두 허용
    files: ['./src/app/**', './src/shared/**'],
    rules: { 'fsd/import-locality': 'off' },
  },
]);
