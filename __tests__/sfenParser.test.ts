import { parseSfen } from '../lib/parser/sfenParser';

const INITIAL_SFEN =
  'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1';

describe('parseSfen', () => {
  it('startpos（手なし）を正常にパース', () => {
    const player = parseSfen('position startpos');
    expect(player).toBeTruthy();
    // moves[0] = {} (initial placeholder only)
    expect((player as any).kifu?.moves).toHaveLength(1);
  });

  it('startpos + 1手をパース', () => {
    const player = parseSfen('position startpos moves 7g7f');
    expect((player as any).kifu?.moves).toHaveLength(2);
  });

  it('position sfen ... moves をパース（2手）', () => {
    const text = `position sfen ${INITIAL_SFEN} moves 7g7f 3c3d`;
    const player = parseSfen(text);
    expect((player as any).kifu?.moves).toHaveLength(3);
  });

  it('ベア SFEN 文字列をパース', () => {
    const player = parseSfen(INITIAL_SFEN);
    expect(player).toBeTruthy();
    expect((player as any).kifu?.moves).toHaveLength(1);
  });

  it('セグメント数が足りない文字列は例外をスロー', () => {
    expect(() => parseSfen('invalid')).toThrow();
  });
});
