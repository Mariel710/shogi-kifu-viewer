import { useWindowDimensions } from 'react-native';

export type ScreenLayout = 'portrait' | 'landscape' | 'tablet';

export interface ScreenLayoutInfo {
  layout: ScreenLayout;
  width: number;
  height: number;
  boardSize: number; // recommended board size in px
  isLandscape: boolean;
  isTablet: boolean;
}

export function useScreenLayout(): ScreenLayoutInfo {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 768;

  let layout: ScreenLayout;
  if (isTablet) layout = 'tablet';
  else if (isLandscape) layout = 'landscape';
  else layout = 'portrait';

  // Portrait/mobile: board fills the width (minus small padding)
  // Landscape/tablet: board takes ~55% of the shorter dimension
  let boardSize: number;
  if (layout === 'portrait') {
    boardSize = width - 8; // near full-width, tiny margin
  } else if (layout === 'landscape') {
    boardSize = height - 8;
  } else {
    // tablet
    boardSize = Math.min(width, height) * 0.7;
  }

  return { layout, width, height, boardSize, isLandscape, isTablet };
}
