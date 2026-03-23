import { Text, StyleSheet } from 'react-native';
import type { PieceType, Player } from '@/lib/shogi/types';
import { PIECE_KANJI, COLORS } from '@/lib/shogi/constants';

// Promoted pieces rendered in red
const PROMOTED_TYPES = new Set<PieceType>(['RY', 'UM', 'NG', 'NK', 'NY', 'TO']);

interface PieceProps {
  type: PieceType;
  player: Player;
  size: number; // square size in px — font scales relative to this
  reversed?: boolean; // true = board shown from gote's perspective
}

export default function Piece({ type, player, size, reversed = false }: PieceProps) {
  const isGote = player === 'gote';
  const isPromoted = PROMOTED_TYPES.has(type);
  const fontSize = size * 0.62;

  // Rotate when piece faces "away" from the viewer:
  //   Normal view (reversed=false): gote pieces are rotated
  //   Gote view  (reversed=true):  sente pieces are rotated
  const shouldRotate = isGote !== reversed;

  return (
    <Text
      style={[
        styles.text,
        { fontSize },
        isPromoted && styles.promoted,
        shouldRotate && styles.rotated,
      ]}
      allowFontScaling={false}
      numberOfLines={1}
    >
      {PIECE_KANJI[type]}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.pieceSente,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: undefined,
  },
  promoted: {
    color: '#C62828',
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
});
