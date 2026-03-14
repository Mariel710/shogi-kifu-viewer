import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '@/lib/shogi/constants';

interface FileImportProps {
  onLoad: (text: string, filename: string) => void;
  error: string | null;
}

export default function FileImport({ onLoad, error }: FileImportProps) {
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const handlePick = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'web'
          ? ['text/plain', 'application/octet-stream', '*/*']
          : ['public.data', 'public.plain-text'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        setLoading(false);
        return;
      }

      const asset = result.assets[0];
      const name = asset.name ?? 'kifu.kif';
      setPicked(name);

      // Read file content
      const response = await fetch(asset.uri);
      const text = await response.text();
      onLoad(text, name);
    } catch (e) {
      console.error('File pick error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>棋譜ファイルを選択してください</Text>
      <Text style={styles.hint}>対応拡張子: .kif / .kifu / .ki2 / .csa / .jkf / .json</Text>

      <TouchableOpacity
        style={styles.pickBtn}
        onPress={handlePick}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.pickBtnText}>ファイルを選択...</Text>
        )}
      </TouchableOpacity>

      {picked && (
        <Text style={styles.pickedName}>選択済み: {picked}</Text>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  pickBtn: {
    height: 52,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F0',
  },
  pickBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  pickedName: {
    marginTop: 12,
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  error: {
    marginTop: 12,
    color: '#C62828',
    fontSize: 12,
  },
});
