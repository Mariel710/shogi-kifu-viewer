import React from 'react';
import Piece from '../components/board/Piece';

// Mock react-native with a minimal implementation so the test runs in Node
jest.mock('react-native', () => ({
  Text: 'Text',
  StyleSheet: {
    create: (styles: Record<string, object>) => styles,
  },
}));

/** Call the component function and return the rendered React element */
function renderPiece(props: Parameters<typeof Piece>[0]): React.ReactElement<any> {
  return (Piece as unknown as (p: typeof props) => React.ReactElement<any>)(props);
}

function flatStyles(el: React.ReactElement<any>): object[] {
  return [el.props.style as object | object[]].flat().filter(Boolean) as object[];
}

describe('Piece', () => {
  it('FU → 歩 を子要素として表示', () => {
    const el = renderPiece({ type: 'FU', player: 'sente', size: 50 });
    expect(el.props.children).toBe('歩');
  });

  it('OU → 玉 を子要素として表示', () => {
    const el = renderPiece({ type: 'OU', player: 'sente', size: 50 });
    expect(el.props.children).toBe('玉');
  });

  it('成駒（TO）は赤色（#C62828）のスタイルを含む', () => {
    const el = renderPiece({ type: 'TO', player: 'sente', size: 50 });
    expect(flatStyles(el)).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#C62828' })])
    );
  });

  it('後手の駒は 180deg 回転スタイルを含む', () => {
    const el = renderPiece({ type: 'FU', player: 'gote', size: 50 });
    expect(flatStyles(el)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ transform: [{ rotate: '180deg' }] }),
      ])
    );
  });

  it('fontSize は size × 0.62', () => {
    const el = renderPiece({ type: 'FU', player: 'sente', size: 100 });
    const base = flatStyles(el).find((s: any) => s.fontSize != null) as any;
    expect(base?.fontSize).toBeCloseTo(62);
  });
});
