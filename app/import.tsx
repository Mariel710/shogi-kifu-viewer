import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextImport from '@/components/import/TextImport';
import FileImport from '@/components/import/FileImport';
import SampleKifuList from '@/components/import/SampleKifuList';
import { useKifuPlayerContext } from '@/contexts/KifuPlayerContext';
import { COLORS } from '@/lib/shogi/constants';

type Tab = 'text' | 'file' | 'sample';

export default function ImportScreen() {
  const router = useRouter();
  const { loadKifu, parseError } = useKifuPlayerContext();
  const [tab, setTab] = useState<Tab>('sample');

  const handleLoad = (text: string, filename?: string) => {
    const success = loadKifu(text, filename);
    // Only navigate back on success; on failure stay and show parseError
    if (success) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TabBtn label="サンプル" active={tab === 'sample'} onPress={() => setTab('sample')} />
        <TabBtn label="テキスト" active={tab === 'text'} onPress={() => setTab('text')} />
        <TabBtn label="ファイル" active={tab === 'file'} onPress={() => setTab('file')} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {tab === 'sample' && (
          <>
            <SampleKifuList onSelect={(text, filename) => handleLoad(text, filename)} />
            {parseError ? (
              <Text style={styles.errorText}>{parseError}</Text>
            ) : null}
          </>
        )}
        {tab === 'text' && (
          <TextImport onLoad={(text) => handleLoad(text)} error={parseError} />
        )}
        {tab === 'file' && (
          <FileImport onLoad={(text, filename) => handleLoad(text, filename)} error={parseError} />
        )}
      </View>

      {/* Cancel */}
      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>キャンセル</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.boardLine,
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E0D8C8',
  },
  cancelText: {
    color: COLORS.primary,
    fontSize: 15,
  },
  errorText: {
    color: '#C62828',
    fontSize: 13,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
