// Type declarations for json-kifu-format v5.5.0 (MIT)
// Source: https://github.com/na2hiro/json-kifu-format

declare module 'json-kifu-format' {
  // ── Piece kinds (CSA notation) ─────────────────────────────────────────────
  type RawKind = 'FU' | 'KY' | 'KE' | 'GI' | 'KI' | 'KA' | 'HI';
  type Kind =
    | RawKind
    | 'OU'
    | 'TO'
    | 'NY'
    | 'NK'
    | 'NG'
    | 'UM'
    | 'RY';

  // 0 = Black / 先手, 1 = White / 後手
  type Color = 0 | 1;

  // ── Board / state types ────────────────────────────────────────────────────
  interface IPiece {
    color?: Color;
    kind?: Kind;
  }

  type IHandFormat = Record<RawKind, number>;

  interface IStateFormat {
    color: Color;
    board: IPiece[][];   // board[x-1][y-1] where x=file(1-9), y=rank(1-9)
    hands: [IHandFormat, IHandFormat]; // [Black/sente, White/gote]
  }

  // ── Move types ─────────────────────────────────────────────────────────────
  interface IPlaceFormat {
    x: number; // file 1-9
    y: number; // rank 1-9
  }

  interface IMoveMoveFormat {
    color: Color;
    from?: IPlaceFormat;   // absent for drops
    to: IPlaceFormat;
    piece: Kind;
    same?: boolean;
    promote?: boolean;
    capture?: Kind;
    relative?: string;
  }

  interface ITimeFormat {
    h?: number;
    m: number;
    s: number;
  }

  interface IMoveFormat {
    comments?: string[];
    move?: IMoveMoveFormat;
    time?: { now: ITimeFormat; total: ITimeFormat };
    special?: string;
    forks?: IMoveFormat[][];
  }

  // ── Full kifu object ───────────────────────────────────────────────────────
  interface IJSONKifuFormat {
    header: Record<string, string>;
    initial?: {
      preset: string;        // "HIRATE" | "OTHER" | …
      data?: IStateFormat;   // required when preset === "OTHER"
    };
    moves: IMoveFormat[];    // index 0 = initial comments; index n = move n
  }

  // ── Readable kifu state ────────────────────────────────────────────────────
  interface IReadableKifuState {
    comments: string[];
    forks: string[];
    kifu: string;
    moveFormat: IMoveFormat;
  }

  // ── JKFPlayer ─────────────────────────────────────────────────────────────
  class JKFPlayer {
    static debug: boolean;

    // Static parse helpers
    static parse(kifu: string, filename?: string): JKFPlayer;
    static parseJKF(kifu: string): JKFPlayer;
    static parseKIF(kifu: string): JKFPlayer;
    static parseKI2(kifu: string): JKFPlayer;
    static parseCSA(kifu: string): JKFPlayer;
    static fromShogi(shogi: Shogi): JKFPlayer;

    // Utility
    static numToZen(n: number): string;
    static numToKan(n: number): string;
    static kindToKan(kind: Kind): string;
    static relativeToKan(relative: string): string;
    static specialToKan(special: string): string;
    static moveToReadableKifu(mv: IMoveFormat): string;
    static doMove(shogi: Shogi, move: IMoveMoveFormat): void;
    static undoMove(shogi: Shogi, move: IMoveMoveFormat): void;
    static getState(shogi: Shogi): IStateFormat;

    constructor(kifu: IJSONKifuFormat);

    shogi: Shogi;
    kifu: IJSONKifuFormat;
    tesuu: number;
    forkPointers: Array<{ te: number; forkIndex: number }>;
    readonly currentStream: IMoveFormat[];

    initialize(kifu: IJSONKifuFormat): void;
    forward(): boolean;
    backward(): boolean;
    goto(tesuu: number): void;
    go(tesuu: number | string): void;
    forkAndForward(num: number | string): boolean;
    getMaxTesuu(): number;
    getState(): IStateFormat;
    getBoard(x: number, y: number): IPiece;
    getComments(tesuu?: number): string[];
    getMove(tesuu?: number): IMoveMoveFormat | undefined;
    getReadableKifu(tesuu?: number): string;
    getReadableKifuState(): IReadableKifuState[];
    toJKF(): string;
    inputMove(move: IMoveMoveFormat): boolean;
  }

  // ── Shogi class (re-exported from shogi.js) ────────────────────────────────
  class Shogi {
    board: Array<Array<{ color: Color; kind: Kind } | null>>;
    hands: Array<Array<{ color: Color; kind: Kind }>>;
    turn: Color;
    flagEditMode: boolean;

    constructor(initial?: { preset?: string; data?: IStateFormat });

    get(x: number, y: number): { color: Color; kind: Kind } | null;
    move(fromX: number, fromY: number, toX: number, toY: number, promote?: boolean): void;
    drop(toX: number, toY: number, kind: Kind, color?: Color): void;
    unmove(fromX: number, fromY: number, toX: number, toY: number, promote?: boolean, capture?: Kind): void;
    undrop(toX: number, toY: number): void;
    initializeFromSFENString(sfen: string): void;
    toSFENString(moveCount?: number): string;
    getHandsSummary(color: Color): IHandFormat;
    nextTurn(): void;
    checkTurn(color: Color): void;
  }

  // ── Namespace exports ──────────────────────────────────────────────────────
  namespace Shogi {
    export { Shogi };
  }

  const Normalizer: unknown;
  const Parsers: unknown;
  const Formats: unknown;

  export {
    JKFPlayer,
    Shogi,
    Normalizer,
    Parsers,
    Formats,
  };

  export type {
    Kind,
    RawKind,
    Color,
    IPiece,
    IHandFormat,
    IStateFormat,
    IPlaceFormat,
    IMoveMoveFormat,
    ITimeFormat,
    IMoveFormat,
    IJSONKifuFormat,
    IReadableKifuState,
  };
}
