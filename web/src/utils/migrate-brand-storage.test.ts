import { migrateBrandStorage } from './migrate-brand-storage';

beforeEach(() => localStorage.clear());

it('moves theme and cache state and removes the previous keys', () => {
  localStorage.setItem('answerwhizai-ui-theme', 'dark');
  localStorage.setItem(
    'answerwhizai_llm_list_cache',
    '{"data":{},"timestamp":123}',
  );
  migrateBrandStorage(localStorage);
  expect(localStorage.getItem('sourcepi-ui-theme')).toBe('dark');
  expect(localStorage.getItem('sourcepi_llm_list_cache')).toBe(
    '{"data":{},"timestamp":123}',
  );
  expect(localStorage.getItem('answerwhizai-ui-theme')).toBeNull();
  expect(localStorage.getItem('answerwhizai_llm_list_cache')).toBeNull();
});

it('preserves a preference already saved under the new key', () => {
  localStorage.setItem('answerwhizai-ui-theme', 'dark');
  localStorage.setItem('sourcepi-ui-theme', 'light');
  migrateBrandStorage(localStorage);
  migrateBrandStorage(localStorage);
  expect(localStorage.getItem('sourcepi-ui-theme')).toBe('light');
  expect(localStorage.getItem('answerwhizai-ui-theme')).toBeNull();
});

it('leaves authentication state unchanged', () => {
  localStorage.setItem('Authorization', 'existing-session');
  migrateBrandStorage(localStorage);
  expect(localStorage.getItem('Authorization')).toBe('existing-session');
});
