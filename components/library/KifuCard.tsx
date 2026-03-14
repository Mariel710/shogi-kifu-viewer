import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { KifuRecord } from '@/lib/storage/kifuDB';
import { COLORS } from '@/lib/shogi/constants';

interface KifuCardProps {
  record: KifuRecord;
  onPress: (record: KifuRecord) => void;
  onDelete: (id: number) => void;
}

export default function KifuCard({ record, onPress, onDelete }: KifuCardProps) {
  const title = record.title || `棋譜 #${record.id}`;
  const players =
    record.sente || record.gote
      ? `☗${record.sente || '先手'}  vs  ☖${record.gote || '後手'}`
      : null;
  const info = [record.event, record.date].filter(Boolean).join(' · ');
  const savedDate = record.savedAt ? new Date(record.savedAt).toLocaleDateString('ja-JP') : '';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(record)} activeOpacity={0.75}>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {players ? (
          <Text style={styles.players} numberOfLines={1}>
            {players}
          </Text>
        ) : null}
        {info ? (
          <Text style={styles.info} numberOfLines={1}>
            {info}
          </Text>
        ) : null}
        <Text style={styles.savedAt}>{savedDate}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(record.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteBtnText}>削除</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  players: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 2,
  },
  info: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  savedAt: {
    fontSize: 10,
    color: '#aaa',
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C62828',
    marginLeft: 10,
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '600',
  },
});
