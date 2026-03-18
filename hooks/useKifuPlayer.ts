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

export interface KifuListItem {
  move: number;
  description: string;
}

export interface KifuPlayerState {
  board: BoardState;
  sentePieces: HandPieces;
  gotePieces: HandPieces;
  currentMove: number;
  totalMoves: number;
  lastMove?: LastMove;
  moveDescription: string; // e.g. "32手目 ☗７六歩"
  kifuList: KifuListItem[];   // full move list for display
  branchMoves: string[];      // fork descriptions at current position
  comments: string[];         // comments for the current move
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
  forkAndForward: (forkIndex: number) => void;
  /** Returns true on success, false on parse error (error message stored in parseError). */
  loadKifu: (text: string, filename?: string) => boolean;
  getJkfJson: () => string | null;
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

  // Move description for current position
  const readableKifu = player.getReadableKifu();
  const moveDescription =
    tesuu === 0 ? '開始局面' : `${tesuu}手目 ${readableKifu}`;

  // Full kifu list from the current stream
  const readableStates = player.getReadableKifuState();
  const kifuList: KifuListItem[] = readableStates.map((s, i) => ({
    move: i,
    description: i === 0 ? '開始局面' : `${i} ${s.kifu}`,
  }));

  // Branch moves at the current position (empty if no forks)
  const branchMoves: string[] = readableStates[tesuu]?.forks ?? [];

  // Comments for the current move
  const comments: string[] = player.getComments(tesuu);

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
    kifuList,
    branchMoves,
    comments,
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
    kifuList: [],
    branchMoves: [],
    comments: [],
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

  const forkAndForward = useCallback(
    (forkIndex: number) => {
      const p = playerRef.current;
      if (!p) return;
      p.forkAndForward(forkIndex);
      syncState();
    },
    [syncState]
  );

  const loadKifu = useCallback(
    (text: string, filename?: string): boolean => {
      try {
        const player = parseKifu(text, filename);
        playerRef.current = player;
        setState((prev) => ({
          ...prev,
          ...buildStateFromPlayer(player),
          parseError: null,
        }));
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : '棋譜の読み込みに失敗しました';
        console.error('[loadKifu] parse error:', msg, err);
        setState((prev) => ({
          ...prev,
          parseError: msg,
        }));
        return false;
      }
    },
    []
  );

  const getJkfJson = useCallback((): string | null => {
    const p = playerRef.current;
    if (!p) return null;
    return JSON.stringify(p.kifu);
  }, []);

  return {
    ...state,
    goForward,
    goBack,
    goToStart,
    goToEnd,
    goTo,
    forkAndForward,
    loadKifu,
    getJkfJson,
  };
}
