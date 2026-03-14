// Global type definitions

export type { PieceType, Player, Piece, BoardState, HandPieces, GameState, Move } from '../lib/shogi/types';
export type { KifuFormat } from '../lib/parser/detectFormat';
export type { KifuRecord } from '../lib/storage/kifuDB';
export type { ScreenLayout, ScreenLayoutInfo } from '../hooks/useScreenLayout';
export type {
  LastMove,
  GameMeta,
  KifuPlayerState,
  KifuPlayerControls,
} from '../hooks/useKifuPlayer';
