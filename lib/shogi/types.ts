// Shogi piece types
export type PieceType =
  | 'OU' | 'HI' | 'KA' | 'KI' | 'GI' | 'KE' | 'KY' | 'FU'
  | 'RY' | 'UM' | 'NG' | 'NK' | 'NY' | 'TO';

export type Player = 'sente' | 'gote';

export interface Piece {
  type: PieceType;
  player: Player;
}

// Board position: [row][col], 0-indexed, row 0 = rank 1, col 0 = file 9
export type BoardState = (Piece | null)[][];

// Hand pieces for one player
export type HandPieces = Partial<Record<PieceType, number>>;

export interface GameState {
  board: BoardState;
  sentePieces: HandPieces;
  gotePieces: HandPieces;
  currentPlayer: Player;
  moveCount: number;
}

export interface Move {
  from?: { row: number; col: number };
  to: { row: number; col: number };
  piece: PieceType;
  promote?: boolean;
  drop?: boolean;
}
