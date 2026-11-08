import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {ignores:['**/node_modules/**','**/dist/**','**/.astro/**','.vercel/**','test-results/**']},
  {files:['**/*.{ts,tsx}'],languageOptions:{parser:ts.parser}},
  ...astro.configs['flat/recommended'],
  {rules:{'no-constant-condition':'error','no-debugger':'error','no-duplicate-case':'error','no-unreachable':'error','valid-typeof':'error'}},
];
