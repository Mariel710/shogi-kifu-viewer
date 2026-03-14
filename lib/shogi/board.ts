import type { BoardState, Piece } from './types';

// Create an empty 9x9 board
export function createEmptyBoard(): BoardState {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

// Create the initial shogi board setup (平手初期配置)
export function createInitialBoard(): BoardState {
  const board = createEmptyBoard();

  // Gote pieces (rows 0-2)
  const goteBackRow: (Piece | null)[] = [
    { type: 'KY', player: 'gote' },
    { type: 'KE', player: 'gote' },
    { type: 'GI', player: 'gote' },
    { type: 'KI', player: 'gote' },
    { type: 'OU', player: 'gote' },
    { type: 'KI', player: 'gote' },
    { type: 'GI', player: 'gote' },
    { type: 'KE', player: 'gote' },
    { type: 'KY', player: 'gote' },
  ];
  board[0] = goteBackRow;
  board[1][1] = { type: 'KA', player: 'gote' };
  board[1][7] = { type: 'HI', player: 'gote' };
  for (let i = 0; i < 9; i++) {
    board[2][i] = { type: 'FU', player: 'gote' };
  }

  // Sente pieces (rows 6-8)
  for (let i = 0; i < 9; i++) {
    board[6][i] = { type: 'FU', player: 'sente' };
  }
  board[7][1] = { type: 'HI', player: 'sente' };
  board[7][7] = { type: 'KA', player: 'sente' };
  const senteBackRow: (Piece | null)[] = [
    { type: 'KY', player: 'sente' },
    { type: 'KE', player: 'sente' },
    { type: 'GI', player: 'sente' },
    { type: 'KI', player: 'sente' },
    { type: 'OU', player: 'sente' },
    { type: 'KI', player: 'sente' },
    { type: 'GI', player: 'sente' },
    { type: 'KE', player: 'sente' },
    { type: 'KY', player: 'sente' },
  ];
  board[8] = senteBackRow;

  return board;
}
