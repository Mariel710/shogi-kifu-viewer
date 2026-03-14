import {
  encodeKifuToUrl,
  decodeKifuFromUrl,
  buildShareUrl,
} from '../lib/share/urlEncoder';

describe('encodeKifuToUrl / decodeKifuFromUrl', () => {
  it('roundtrips ASCII text', () => {
    const text = '{"header":{},"moves":[{}]}';
    expect(decodeKifuFromUrl(encodeKifuToUrl(text))).toBe(text);
  });

  it('roundtrips Japanese text', () => {
    const text = '先手：テスト\n後手：サンプル';
    expect(decodeKifuFromUrl(encodeKifuToUrl(text))).toBe(text);
  });

  it('roundtrips a typical KIF string', () => {
    const kif = [
      '手合割：平手',
      '先手：羽生善治',
      '後手：佐藤康光',
      '手数----指手---------消費時間--',
      '   1 ７六歩(77)',
      '   2 ３四歩(34)',
    ].join('\n');
    expect(decodeKifuFromUrl(encodeKifuToUrl(kif))).toBe(kif);
  });

  it('returns a non-empty string for any input', () => {
    expect(encodeKifuToUrl('x').length).toBeGreaterThan(0);
  });

  it('different inputs produce different encoded values', () => {
    expect(encodeKifuToUrl('abc')).not.toBe(encodeKifuToUrl('xyz'));
  });
});

describe('buildShareUrl', () => {
  it('appends data query parameter to base URL', () => {
    const url = buildShareUrl('kifuviewer://kifu', '{}');
    expect(url).toMatch(/^kifuviewer:\/\/kifu\?data=/);
  });

  it('decoded data matches original kifu text', () => {
    const kifuText = '先手：テスト';
    const url = buildShareUrl('https://example.com/kifu', kifuText);
    const encoded = url.split('?data=')[1];
    expect(decodeKifuFromUrl(encoded)).toBe(kifuText);
  });

  it('uses provided baseUrl as prefix', () => {
    const base = 'myapp://share';
    const url = buildShareUrl(base, 'test');
    expect(url.startsWith(base + '?data=')).toBe(true);
  });
});
