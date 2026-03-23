import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '@/lib/shogi/constants';

interface TextImportProps {
  onLoad: (text: string) => void;
  error: string | null;
}

export default function TextImport({ onLoad, error }: TextImportProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    setTimeout(() => {
      onLoad(trimmed);
      setLoading(false);
    }, 50);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <Text style={styles.label}>棋譜テキストを貼り付けてください</Text>
        <Text style={styles.hint}>対応形式: KIF / KI2 / CSA / SFEN / JKF</Text>

        {/* Scrollable input area with max height */}
        <ScrollView
          style={styles.inputScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            placeholder={'例）\n手合割：平手\n1 ７六歩(77)\n...'}
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            autoCorrect={false}
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </ScrollView>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Load button — always visible above keyboard */}
        <TouchableOpacity
          style={[styles.btn, !text.trim() && styles.btnDisabled]}
          onPress={handleLoad}
          disabled={!text.trim() || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>読み込む</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    marginBottom: 10,
  },
  inputScroll: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: COLORS.boardLine,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    fontSize: 13,
    color: COLORS.textMain,
    minHeight: 160,
  },
  error: {
    color: '#C62828',
    fontSize: 12,
    marginTop: 8,
  },
  btn: {
    marginTop: 12,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
