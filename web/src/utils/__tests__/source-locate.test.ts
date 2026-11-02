import { supportsSourceLocate } from '../source-locate';

describe('supportsSourceLocate', () => {
  it('accepts PDF, Excel and Word previews case-insensitively', () => {
    expect(supportsSourceLocate('pdf')).toBe(true);
    expect(supportsSourceLocate('XLSX')).toBe(true);
    expect(supportsSourceLocate('xls')).toBe(true);
    expect(supportsSourceLocate('docx')).toBe(true);
  });

  it('rejects unsupported or missing extensions', () => {
    expect(supportsSourceLocate('html')).toBe(false);
    expect(supportsSourceLocate('zip')).toBe(false);
    expect(supportsSourceLocate(undefined)).toBe(false);
  });
});
