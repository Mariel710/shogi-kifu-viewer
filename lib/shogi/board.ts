import type { BoardState, HandPieces, Piece, PieceType } from './types';

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

/**
 * Convert JKF state board (board[x-1][y-1], col-major, x=file 1-9) to our
 * board (board[row][col], row=rank-1, col=9-file).
 *
 * Mapping: my board[row][col] = jkfBoard[8-col][row]
 *   because col=9-x → x-1=8-col
 */
export function jkfBoardToMyBoard(
  jkfBoard: Array<Array<{ color?: number; kind?: string }>>
): BoardState {
  const board = createEmptyBoard();
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const p = jkfBoard[8 - col]?.[row];
      if (p && p.kind !== undefined && p.color !== undefined) {
        board[row][col] = {
          type: p.kind as PieceType,
          player: p.color === 0 ? 'sente' : 'gote',
        };
      }
    }
  }
  return board;
}

/**
 * Convert JKF hand format {FU:n, KY:n, ...} to our HandPieces type.
 * Zero-count entries are omitted.
 */
export function jkfHandToMyHand(
  jkfHand: Partial<Record<string, number>>
): HandPieces {
  const hand: HandPieces = {};
  for (const [key, count] of Object.entries(jkfHand)) {
    if (count && count > 0) {
      hand[key as PieceType] = count;
    }
  }
  return hand;
}
