/**
 * SFEN (Universal Shogi Interface) format parser.
 *
 * Accepts:
 *   - Bare SFEN string: "lnsgkgsnl/1r5b1/... b - 1"
 *   - USI position string: "position sfen <sfen> [moves <m1> <m2> ...]"
 *   - USI startpos: "position startpos [moves <m1> <m2> ...]"
 */
import { JKFPlayer, Shogi as ShogiNS } from 'json-kifu-format';

// SFEN letter → JKF piece kind
const SFEN_KIND: Record<string, string> = {
  K: 'OU', R: 'HI', B: 'KA', G: 'KI', S: 'GI', N: 'KE', L: 'KY', P: 'FU',
  '+R': 'RY', '+B': 'UM', '+S': 'NG', '+N': 'NK', '+L': 'NY', '+P': 'TO',
};

// Rank letter (a-i) → number (1-9)
function rankLetterToNum(c: string): number {
  return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

/** Parse a SFEN move string and return JKF move format components */
function parseSfenMove(
  shogi: InstanceType<typeof ShogiNS.Shogi>,
  sfenMove: string,
  color: number
): {
  from?: { x: number; y: number };
  to: { x: number; y: number };
  piece: string;
  capture?: string;
  promote?: boolean;
  color: number;
} | null {
  try {
    const promote = sfenMove.endsWith('+');
    const m = promote ? sfenMove.slice(0, -1) : sfenMove;

    // Drop: P*7f
    const dropMatch = m.match(/^([KRBGSNLP])\*(\d)([a-i])$/);
    if (dropMatch) {
      const toX = parseInt(dropMatch[2]);
      const toY = rankLetterToNum(dropMatch[3]);
      const kind = SFEN_KIND[dropMatch[1]] ?? dropMatch[1];
      return { to: { x: toX, y: toY }, piece: kind, color };
    }

    // Regular move: 7g7f or 7g7f+
    const moveMatch = m.match(/^(\d)([a-i])(\d)([a-i])$/);
    if (!moveMatch) return null;

    const fromX = parseInt(moveMatch[1]);
    const fromY = rankLetterToNum(moveMatch[2]);
    const toX = parseInt(moveMatch[3]);
    const toY = rankLetterToNum(moveMatch[4]);

    // Look up piece at from position
    const piece = shogi.get(fromX, fromY);
    if (!piece) return null;
    const pieceKind = piece.kind as string;

    // Look up captured piece at to position (before the move)
    const captured = shogi.get(toX, toY);
    const captureKind = captured ? (captured.kind as string) : undefined;

    return {
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      piece: pieceKind,
      capture: captureKind,
      promote: promote || undefined,
      color,
    };
  } catch {
    return null;
  }
}

export function parseSfen(text: string): JKFPlayer {
  const trimmed = text.trim();

  // Detect format and extract SFEN string + moves
  let sfenStr: string;
  let moveTokens: string[] = [];

  if (trimmed.startsWith('position startpos')) {
    sfenStr = 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1';
    const movesIdx = trimmed.indexOf(' moves ');
    if (movesIdx !== -1) {
      moveTokens = trimmed.slice(movesIdx + 7).trim().split(/\s+/);
    }
  } else if (trimmed.startsWith('position sfen ')) {
    const rest = trimmed.slice('position sfen '.length);
    const movesIdx = rest.indexOf(' moves ');
    if (movesIdx !== -1) {
      sfenStr = rest.slice(0, movesIdx).trim();
      moveTokens = rest.slice(movesIdx + 7).trim().split(/\s+/);
    } else {
      sfenStr = rest.trim();
    }
  } else {
    // Bare SFEN string; moves part starts after the 4th segment
    const parts = trimmed.split(/\s+/);
    if (parts.length < 4) throw new Error('Invalid SFEN string');
    sfenStr = parts.slice(0, 4).join(' ');
    const movesStart = parts.indexOf('moves');
    if (movesStart !== -1) {
      moveTokens = parts.slice(movesStart + 1);
    }
  }

  // Initialize Shogi from SFEN
  const shogi = new ShogiNS.Shogi();
  shogi.initializeFromSFENString(sfenStr);

  // Get initial state in JKF format
  const initialState = JKFPlayer.getState(shogi);

  // Build moves array
  const moves: object[] = [{}]; // index 0 = initial (comments only)
  let currentColor = initialState.color as number;

  for (const sfenMove of moveTokens.filter(Boolean)) {
    const mv = parseSfenMove(shogi, sfenMove, currentColor);
    if (!mv) break;

    // Apply move to shogi board to advance state
    try {
      if (mv.from) {
        shogi.move(mv.from.x, mv.from.y, mv.to.x, mv.to.y, mv.promote ?? false);
      } else {
        shogi.drop(mv.to.x, mv.to.y, mv.piece as Parameters<typeof shogi.drop>[2], currentColor as Parameters<typeof shogi.drop>[3]);
      }
    } catch {
      break;
    }

    moves.push({ move: mv });
    currentColor = currentColor === 0 ? 1 : 0;
  }

  const jkf = {
    header: {},
    initial: {
      preset: 'OTHER',
      data: initialState,
    },
    moves,
  };

  return new JKFPlayer(jkf as Parameters<typeof JKFPlayer['prototype']['initialize']>[0]);
}
