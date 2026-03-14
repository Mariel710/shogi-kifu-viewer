import { useState, useCallback } from 'react';
import type { BoardState, HandPieces } from '@/lib/shogi/types';
import { createInitialBoard } from '@/lib/shogi/board';

export interface LastMove {
  from?: { row: number; col: number };
  to: { row: number; col: number };
}

export interface KifuPlayerState {
  board: BoardState;
  sentePieces: HandPieces;
  gotePieces: HandPieces;
  currentMove: number;
  totalMoves: number;
  lastMove?: LastMove;
  moveDescription: string; // e.g. "32手目 ☗７六歩"
}

export interface KifuPlayerControls {
  goForward: () => void;
  goBack: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goTo: (move: number) => void;
}

export function useKifuPlayer(): KifuPlayerState & KifuPlayerControls {
  // Phase 3 will wire this to JKFPlayer from json-kifu-format.
  // For now, display the initial board with empty hands.
  const [board] = useState<BoardState>(createInitialBoard);
  const [currentMove] = useState(0);

  const goForward = useCallback(() => {
    // Phase 3: advance JKFPlayer and sync board state
  }, []);

  const goBack = useCallback(() => {
    // Phase 3: retreat JKFPlayer and sync board state
  }, []);

  const goToStart = useCallback(() => {
    // Phase 3
  }, []);

  const goToEnd = useCallback(() => {
    // Phase 3
  }, []);

  const goTo = useCallback((_move: number) => {
    // Phase 3
  }, []);

  return {
    board,
    sentePieces: {},
    gotePieces: {},
    currentMove,
    totalMoves: 0,
    lastMove: undefined,
    moveDescription: '開始局面',
    goForward,
    goBack,
    goToStart,
    goToEnd,
    goTo,
  };
}
