import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import KifuCard from './KifuCard';
import type { KifuRecord } from '@/lib/storage/kifuDB';
import { COLORS } from '@/lib/shogi/constants';

interface LibraryListProps {
  records: KifuRecord[];
  loading: boolean;
  onSelect: (record: KifuRecord) => void;
  onDelete: (id: number) => void;
}

export default function LibraryList({ records, loading, onSelect, onDelete }: LibraryListProps) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (records.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>保存された棋譜はありません</Text>
        <Text style={styles.emptyHint}>棋譜ビューアで棋譜を読み込み、「保存」ボタンを押してください</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <KifuCard record={item} onPress={onSelect} onDelete={onDelete} />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
});
