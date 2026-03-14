import { describe, it, expect } from '@jest/globals';
import { createInitialBoard, createEmptyBoard, jkfBoardToMyBoard, jkfHandToMyHand } from '../lib/shogi/board';

describe('createEmptyBoard', () => {
  it('returns a 9x9 grid of nulls', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    board.forEach((row) => {
      expect(row).toHaveLength(9);
      row.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

describe('createInitialBoard', () => {
  it('places gote OU at row 0, col 4', () => {
    const board = createInitialBoard();
    expect(board[0][4]).toEqual({ type: 'OU', player: 'gote' });
  });

  it('places sente OU at row 8, col 4', () => {
    const board = createInitialBoard();
    expect(board[8][4]).toEqual({ type: 'OU', player: 'sente' });
  });

  it('places sente FU pawns in row 6', () => {
    const board = createInitialBoard();
    for (let col = 0; col < 9; col++) {
      expect(board[6][col]).toEqual({ type: 'FU', player: 'sente' });
    }
  });

  it('places gote FU pawns in row 2', () => {
    const board = createInitialBoard();
    for (let col = 0; col < 9; col++) {
      expect(board[2][col]).toEqual({ type: 'FU', player: 'gote' });
    }
  });

  it('places sente HI at row 7, col 1', () => {
    const board = createInitialBoard();
    expect(board[7][1]).toEqual({ type: 'HI', player: 'sente' });
  });

  it('places sente KA at row 7, col 7', () => {
    const board = createInitialBoard();
    expect(board[7][7]).toEqual({ type: 'KA', player: 'sente' });
  });
});

describe('jkfBoardToMyBoard', () => {
  it('converts a single piece correctly', () => {
    // JKF board is col-major: jkfBoard[x-1][y-1] where x=file(1-9), y=rank(1-9)
    // For col=4 (file 5, x=5), row=0 (rank 1, y=1):
    //   jkfBoard[8-col][row] = jkfBoard[4][0]
    const jkfBoard: { color?: number; kind?: string }[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill({}));
    jkfBoard[4][0] = { color: 0, kind: 'OU' }; // sente OU at row=0, col=4
    const board = jkfBoardToMyBoard(jkfBoard);
    expect(board[0][4]).toEqual({ type: 'OU', player: 'sente' });
  });

  it('maps color=1 to gote', () => {
    const jkfBoard: { color?: number; kind?: string }[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill({}));
    jkfBoard[4][0] = { color: 1, kind: 'OU' };
    const board = jkfBoardToMyBoard(jkfBoard);
    expect(board[0][4]).toEqual({ type: 'OU', player: 'gote' });
  });

  it('ignores cells without kind/color', () => {
    const jkfBoard: { color?: number; kind?: string }[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill({}));
    const board = jkfBoardToMyBoard(jkfBoard);
    expect(board[4][4]).toBeNull();
  });
});

describe('jkfHandToMyHand', () => {
  it('converts non-zero piece counts', () => {
    const hand = jkfHandToMyHand({ FU: 3, KY: 0, KA: 1 });
    expect(hand['FU']).toBe(3);
    expect(hand['KA']).toBe(1);
    expect(hand['KY']).toBeUndefined();
  });

  it('returns empty object for empty hand', () => {
    expect(jkfHandToMyHand({})).toEqual({});
  });
});
