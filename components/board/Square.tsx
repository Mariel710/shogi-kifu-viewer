import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/lib/shogi/constants';

export type HighlightType = 'none' | 'lastTo' | 'lastFrom';

interface SquareProps {
  size: number;
  highlight?: HighlightType;
  children?: React.ReactNode;
}

export default function Square({ size, highlight = 'none', children }: SquareProps) {
  const highlightColor =
    highlight === 'lastTo'
      ? COLORS.highlightLastTo
      : highlight === 'lastFrom'
        ? COLORS.highlightLastFrom
        : undefined;

  return (
    <View
      style={[
        styles.square,
        { width: size, height: size },
        highlightColor ? { backgroundColor: highlightColor } : null,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.boardLine,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.boardBg,
    overflow: 'hidden',
  },
});
