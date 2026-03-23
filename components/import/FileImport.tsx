import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '@/lib/shogi/constants';

interface FileImportProps {
  onLoad: (text: string, filename: string) => void;
  error: string | null;
}

/** Decode a Uint8Array as UTF-8; if that yields replacement chars, try Shift_JIS via TextDecoder. */
function decodeBytes(bytes: Uint8Array): string {
  // Try UTF-8 first
  const utf8 = new TextDecoder('utf-8').decode(bytes);
  // If no replacement characters (U+FFFD), it's valid UTF-8
  if (!utf8.includes('\uFFFD')) return utf8;

  // Try Shift_JIS (supported on Web; may gracefully fail on native)
  try {
    return new TextDecoder('shift_jis').decode(bytes);
  } catch {
    // Shift_JIS not supported in this runtime — return UTF-8 best-effort
    return utf8;
  }
}

export default function FileImport({ onLoad, error }: FileImportProps) {
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePick = async () => {
    try {
      setLoading(true);
      setLocalError(null);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
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
      console.log('[FileImport] picked:', name, 'uri:', asset.uri);

      // Read as binary to support Shift_JIS KIF files
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const text = decodeBytes(bytes);

      console.log('[FileImport] decoded text (first 120):', text.slice(0, 120));
      onLoad(text, name);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[FileImport] error:', msg);
      setLocalError(`ファイル読み込みエラー: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const displayError = error ?? localError;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>棋譜ファイルを選択してください</Text>
      <Text style={styles.hint}>対応形式: KIF / KI2 / CSA / JKF（UTF-8・Shift_JIS対応）</Text>

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

      {displayError ? <Text style={styles.error}>{displayError}</Text> : null}
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
