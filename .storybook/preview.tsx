import '@/app/globals.css';

import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
