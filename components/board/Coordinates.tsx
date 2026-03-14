import { View, Text, StyleSheet } from 'react-native';
import { FILE_LABELS, RANK_LABELS } from '@/lib/shogi/constants';

interface CoordinatesProps {
  squareSize: number;
  reversed?: boolean; // true = gote perspective (board flipped)
}

export default function Coordinates({ squareSize, reversed = false }: CoordinatesProps) {
  const fontSize = squareSize * 0.38;
  const coordSize = squareSize * 0.55;

  const files = reversed ? [...FILE_LABELS].reverse() : FILE_LABELS;
  const ranks = reversed ? [...RANK_LABELS].reverse() : RANK_LABELS;

  return (
    <>
      {/* File numbers along the top (9→1 or 1→9 when reversed) */}
      <View style={[styles.fileRow, { height: coordSize, marginLeft: coordSize }]}>
        {files.map((label) => (
          <View key={label} style={{ width: squareSize, alignItems: 'center' }}>
            <Text style={[styles.coordText, { fontSize }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Rank kanji along the right side (一→九 or 九→一 when reversed) */}
      <View style={styles.rankColumn}>
        {ranks.map((label) => (
          <View key={label} style={{ height: squareSize, width: coordSize, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.coordText, { fontSize }]}>{label}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fileRow: {
    flexDirection: 'row',
  },
  rankColumn: {
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'column',
  },
  coordText: {
    color: '#5a4a3a',
  },
});
