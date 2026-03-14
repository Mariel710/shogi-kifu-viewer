import { View, Text, StyleSheet } from 'react-native';
import type { Player, HandPieces } from '@/lib/shogi/types';
import { PIECE_KANJI, HAND_PIECE_ORDER, COLORS } from '@/lib/shogi/constants';

interface HandProps {
  player: Player;
  pieces: HandPieces;
  pieceSize: number; // reference size for font scaling
}

export default function Hand({ player, pieces, pieceSize }: HandProps) {
  const isGote = player === 'gote';
  const fontSize = pieceSize * 0.55;
  const countFontSize = pieceSize * 0.38;

  const items = HAND_PIECE_ORDER.filter((t) => (pieces[t] ?? 0) > 0).map((type) => ({
    type,
    count: pieces[type] ?? 0,
  }));

  return (
    <View style={[styles.container, isGote && styles.gote]}>
      <Text style={[styles.label, { fontSize: countFontSize }]}>
        {isGote ? '☖ 後手' : '☗ 先手'}
      </Text>
      <View style={styles.pieces}>
        {items.length === 0 ? (
          <Text style={[styles.empty, { fontSize: countFontSize }]}>なし</Text>
        ) : (
          items.map(({ type, count }) => (
            <View key={type} style={styles.pieceItem}>
              <Text
                style={[styles.pieceText, { fontSize }, isGote && styles.rotatedPiece]}
                allowFontScaling={false}
              >
                {PIECE_KANJI[type]}
              </Text>
              {count > 1 && (
                <Text style={[styles.countText, { fontSize: countFontSize }]}>{count}</Text>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.handBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 36,
    flexWrap: 'wrap',
    gap: 2,
  },
  gote: {
    // gote hand sits at the top — no visual difference, board orientation handles it
  },
  label: {
    color: COLORS.textMain,
    marginRight: 8,
    fontWeight: '600',
  },
  pieces: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  pieceItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pieceText: {
    color: COLORS.pieceSente,
    fontWeight: 'bold',
  },
  rotatedPiece: {
    transform: [{ rotate: '180deg' }],
  },
  countText: {
    color: COLORS.textMain,
    marginLeft: 1,
  },
  empty: {
    color: '#999',
  },
});
