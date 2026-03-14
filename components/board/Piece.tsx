import { Text, StyleSheet } from 'react-native';
import type { PieceType, Player } from '@/lib/shogi/types';
import { PIECE_KANJI, COLORS } from '@/lib/shogi/constants';

// Promoted pieces rendered in red
const PROMOTED_TYPES = new Set<PieceType>(['RY', 'UM', 'NG', 'NK', 'NY', 'TO']);

interface PieceProps {
  type: PieceType;
  player: Player;
  size: number; // square size in px — font scales relative to this
}

export default function Piece({ type, player, size }: PieceProps) {
  const isGote = player === 'gote';
  const isPromoted = PROMOTED_TYPES.has(type);
  const fontSize = size * 0.62;

  return (
    <Text
      style={[
        styles.text,
        { fontSize },
        isPromoted && styles.promoted,
        isGote && styles.rotated,
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
    lineHeight: undefined, // let font size drive the height
  },
  promoted: {
    color: '#C62828',
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
});
