import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useKifuPlayerContext } from '@/contexts/KifuPlayerContext';
import { decodeKifuFromUrl } from '@/lib/share/urlEncoder';
import { COLORS } from '@/lib/shogi/constants';

export default function KifuDeepLinkScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const { loadKifu } = useKifuPlayerContext();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.replace('/(tabs)');
      return;
    }
    try {
      const jkfText = decodeKifuFromUrl(String(data));
      loadKifu(jkfText, 'shared.jkf');
    } catch {
      // Decode failure — navigate anyway; parseError will surface in the main screen
    }
    router.replace('/(tabs)');
  }, [data, loadKifu, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.label}>棋譜を読み込み中...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgMain,
  },
  label: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textMain,
  },
});
