import { useState, useCallback, useRef } from 'react';
import { JKFPlayer } from 'json-kifu-format';
import type { BoardState, HandPieces } from '@/lib/shogi/types';
import { createInitialBoard, jkfBoardToMyBoard, jkfHandToMyHand } from '@/lib/shogi/board';
import { parseKifu } from '@/lib/parser';

export interface LastMove {
  from?: { row: number; col: number };
  to: { row: number; col: number };
}

export interface GameMeta {
  sente: string;
  gote: string;
  event: string;
  date: string;
}

export interface KifuPlayerState {
  board: BoardState;
  sentePieces: HandPieces;
  gotePieces: HandPieces;
  currentMove: number;
  totalMoves: number;
  lastMove?: LastMove;
  moveDescription: string; // e.g. "32手目 ☗７六歩"
  meta: GameMeta;
  isLoaded: boolean;
  parseError: string | null;
}

export interface KifuPlayerControls {
  goForward: () => void;
  goBack: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  goTo: (move: number) => void;
  loadKifu: (text: string, filename?: string) => void;
}

const INITIAL_META: GameMeta = { sente: '', gote: '', event: '', date: '' };

/** Extract row/col coordinates of a JKF move's from/to for lastMove highlighting */
function jkfMoveToLastMove(
  mv: { from?: { x: number; y: number }; to: { x: number; y: number } }
): LastMove {
  return {
    from: mv.from ? { row: mv.from.y - 1, col: 9 - mv.from.x } : undefined,
    to: { row: mv.to.y - 1, col: 9 - mv.to.x },
  };
}

/** Sync React state from the current JKFPlayer position */
function buildStateFromPlayer(player: JKFPlayer): Omit<KifuPlayerState, 'parseError'> {
  const state = player.getState();

  const board = jkfBoardToMyBoard(
    state.board as { color?: number; kind?: string }[][]
  );

  const sentePieces = jkfHandToMyHand(
    state.hands[0] as Partial<Record<string, number>>
  );
  const gotePieces = jkfHandToMyHand(
    state.hands[1] as Partial<Record<string, number>>
  );

  const tesuu = player.tesuu;
  const totalMoves = player.getMaxTesuu();

  // Move description
  const readableKifu = player.getReadableKifu();
  const moveDescription =
    tesuu === 0 ? '開始局面' : `${tesuu}手目 ${readableKifu}`;

  // Last move highlight (from the move that was just made, if any)
  let lastMove: LastMove | undefined;
  if (tesuu > 0) {
    const mv = player.getMove(tesuu);
    if (mv?.to) {
      lastMove = jkfMoveToLastMove(mv);
    }
  }

  const header = player.kifu.header;
  const meta: GameMeta = {
    sente: (header['先手'] ?? header['下手'] ?? '') as string,
    gote: (header['後手'] ?? header['上手'] ?? '') as string,
    event: (header['棋戦'] ?? '') as string,
    date: (header['開始日時'] ?? header['日付'] ?? '') as string,
  };

  return {
    board,
    sentePieces,
    gotePieces,
    currentMove: tesuu,
    totalMoves,
    lastMove,
    moveDescription,
    meta,
    isLoaded: true,
  };
}

export function useKifuPlayer(): KifuPlayerState & KifuPlayerControls {
  const playerRef = useRef<JKFPlayer | null>(null);

  const [state, setState] = useState<KifuPlayerState>({
    board: createInitialBoard(),
    sentePieces: {},
    gotePieces: {},
    currentMove: 0,
    totalMoves: 0,
    lastMove: undefined,
    moveDescription: '開始局面',
    meta: INITIAL_META,
    isLoaded: false,
    parseError: null,
  });

  const syncState = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    setState((prev) => ({
      ...prev,
      ...buildStateFromPlayer(p),
      parseError: null,
    }));
  }, []);

  const goForward = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.forward();
    syncState();
  }, [syncState]);

  const goBack = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.backward();
    syncState();
  }, [syncState]);

  const goToStart = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.goto(0);
    syncState();
  }, [syncState]);

  const goToEnd = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.goto(p.getMaxTesuu());
    syncState();
  }, [syncState]);

  const goTo = useCallback(
    (move: number) => {
      const p = playerRef.current;
      if (!p) return;
      p.goto(Math.max(0, Math.min(move, p.getMaxTesuu())));
      syncState();
    },
    [syncState]
  );

  const loadKifu = useCallback(
    (text: string, filename?: string) => {
      try {
        const player = parseKifu(text, filename);
        playerRef.current = player;
        setState((prev) => ({
          ...prev,
          ...buildStateFromPlayer(player),
          parseError: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          parseError: err instanceof Error ? err.message : '棋譜の読み込みに失敗しました',
        }));
      }
    },
    []
  );

  return {
    ...state,
    goForward,
    goBack,
    goToStart,
    goToEnd,
    goTo,
    loadKifu,
  };
}
