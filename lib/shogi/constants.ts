import type { PieceType } from './types';

// Color scheme from design document
export const COLORS = {
  // 盤面
  boardBg: '#DEB887',
  boardLine: '#8B7355',
  boardStar: '#8B7355',
  // 駒
  pieceSente: '#1a1a1a',
  pieceGote: '#1a1a1a',
  // ハイライト
  highlightLastTo: '#FFEB3B99',
  highlightLastFrom: '#FFEB3B44',
  highlightBranch: '#42A5F544',
  // 持駒エリア
  handBg: '#F5F0E8',
  // UI
  primary: '#5D4037',
  primaryLight: '#8B6914',
  bgMain: '#FAFAF5',
  textMain: '#333333',
} as const;

// Kanji representation of pieces
export const PIECE_KANJI: Record<PieceType, string> = {
  OU: '玉',
  HI: '飛',
  KA: '角',
  KI: '金',
  GI: '銀',
  KE: '桂',
  KY: '香',
  FU: '歩',
  RY: '龍',
  UM: '馬',
  NG: '全',
  NK: '圭',
  NY: '杏',
  TO: 'と',
};

// Display order for hand pieces
export const HAND_PIECE_ORDER: PieceType[] = [
  'HI', 'KA', 'KI', 'GI', 'KE', 'KY', 'FU',
];

// Rank labels (段)
export const RANK_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

// File labels (筋): 9 to 1
export const FILE_LABELS = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];
