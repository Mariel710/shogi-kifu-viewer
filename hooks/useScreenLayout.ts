import { Platform, useWindowDimensions } from 'react-native';

export type ScreenLayout = 'portrait' | 'landscape' | 'tablet';

export interface ScreenLayoutInfo {
  layout: ScreenLayout;
  width: number;
  height: number;
  boardSize: number; // recommended board size in px
  isLandscape: boolean;
  isTablet: boolean;
}

// On large screens (web/desktop) cap the board so it fits within the viewport.
// Mobile layouts are unaffected because their screen dimensions are already small.
const WEB_MAX_BOARD = 440;

export function useScreenLayout(): ScreenLayoutInfo {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 768;

  let layout: ScreenLayout;
  if (isTablet) layout = 'tablet';
  else if (isLandscape) layout = 'landscape';
  else layout = 'portrait';

  let boardSize: number;
  if (layout === 'portrait') {
    boardSize = width - 8;
    if (Platform.OS === 'web') boardSize = Math.min(boardSize, WEB_MAX_BOARD);
  } else if (layout === 'landscape') {
    boardSize = height - 8;
    if (Platform.OS === 'web') boardSize = Math.min(boardSize, WEB_MAX_BOARD);
  } else {
    // tablet
    boardSize = Math.min(width, height) * 0.7;
    if (Platform.OS === 'web') boardSize = Math.min(boardSize, WEB_MAX_BOARD);
  }

  return { layout, width, height, boardSize, isLandscape, isTablet };
}
