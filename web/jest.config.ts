import type { Config } from 'jest';

const MarkdownEsmPackages = [
  'react-markdown',
  '(?:rehype|remark|hast|mdast|micromark|unist|estree|vfile)(?:-[^/]+)?',
  'hastscript',
  'unified',
  'bail',
  'trough',
  'devlop',
  'is-[^/]+',
  'property-information',
  '(?:space|comma)-separated-tokens',
  'web-namespaces',
  'zwitch',
  'ccount',
  'decode-named-character-reference',
  'character-entities(?:-[^/]+)?',
  'stringify-entities',
  'parse5',
  'html-[^/]+',
  'trim-lines',
  'longest-streak',
  'markdown-table',
  'escape-string-regexp',
  'style-to-(?:js|object)',
  'collapse-white-space',
].join('|');

const config: Config = {
  testEnvironment: '<rootDir>/jest-environment.cjs',
  transform: {
    // Shared TypeScript/Vite preprocessing followed by Jest mock hoisting.
    '^.+\\.(ts|tsx|js|jsx)$': '<rootDir>/jest-esbuild-transformer.cjs',
  },
  // Exercise the real Markdown parsing/sanitization pipeline in CommonJS Jest.
  transformIgnorePatterns: [`/node_modules/(?!(?:${MarkdownEsmPackages})/)`],
  moduleNameMapper: {
    // Asset/style stubs must precede the `@/` alias — the alias rewrites
    // `@/assets/x.png` to a real path and only the first matching mapper runs.
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    // Drags the app shell (routes/react-router) into jsdom; see __mocks__
    '^@/components/layout-recognize-form-field$':
      '<rootDir>/__mocks__/layout-recognize-form-field.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^human-id$': '<rootDir>/__mocks__/human-id.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/.umi/**',
    '!src/.umi-test/**',
    '!src/.umi-production/**',
    '!**/*.d.ts',
    '!coverage/**',
    '!dist/**',
    '!config/**',
    '!mock/**',
  ],
  coverageThreshold: {
    global: {
      lines: 1,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
