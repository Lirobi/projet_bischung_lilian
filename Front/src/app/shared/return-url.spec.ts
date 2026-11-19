import { safeReturnUrl } from './return-url';

describe('safeReturnUrl', () => {
  it('garde une URL interne', () => {
    expect(safeReturnUrl('/pollutions/nouvelle?x=1')).toBe('/pollutions/nouvelle?x=1');
  });

  it.each([undefined, null, '', 'https://example.com', '//example.com', '/\\example.com', 'pollutions'])(
    'rejette %s',
    (url) => {
      expect(safeReturnUrl(url)).toBe('/pollutions');
    },
  );
});
