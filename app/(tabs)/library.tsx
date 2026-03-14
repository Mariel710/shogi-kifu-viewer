import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LibraryList from '@/components/library/LibraryList';
import { useKifuLibrary } from '@/hooks/useKifuLibrary';
import { useKifuPlayerContext } from '@/contexts/KifuPlayerContext';
import type { KifuRecord } from '@/lib/storage/kifuDB';
import { COLORS } from '@/lib/shogi/constants';

export default function LibraryScreen() {
  const router = useRouter();
  const { kifuList, loading, deleteKifu } = useKifuLibrary();
  const { loadKifu } = useKifuPlayerContext();

  const handleSelect = (record: KifuRecord) => {
    loadKifu(record.jkfData, record.title || undefined);
    router.push('/');
  };

  const handleDelete = (id: number) => {
    Alert.alert('棋譜を削除', 'この棋譜を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteKifu(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>棋譜ライブラリ</Text>
        <TouchableOpacity onPress={() => router.push('/import')} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ 読み込む</Text>
        </TouchableOpacity>
      </View>
      <LibraryList
        records={kifuList}
        loading={loading}
        onSelect={handleSelect}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.boardLine,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
