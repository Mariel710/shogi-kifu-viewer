import { useWindowDimensions } from 'react-native';

export type ScreenLayout = 'portrait' | 'landscape' | 'tablet';

export function useScreenLayout(): ScreenLayout {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 768;

  if (isTablet) return 'tablet';
  if (isLandscape) return 'landscape';
  return 'portrait';
}
