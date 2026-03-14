import { TouchableOpacity, Text, StyleSheet, Platform, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { COLORS } from '@/lib/shogi/constants';
import { buildShareUrl } from '@/lib/share/urlEncoder';

interface ShareButtonProps {
  getJkfJson: () => string | null;
  title?: string;
  disabled?: boolean;
}

export default function ShareButton({ getJkfJson, title, disabled }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      const jkfJson = getJkfJson();
      if (!jkfJson) return;

      const baseUrl = Linking.createURL('kifu');
      const url = buildShareUrl(baseUrl, jkfJson);

      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({ title: title ?? '棋譜', url });
        } else {
          await navigator.clipboard.writeText(url);
        }
        return;
      }

      await Share.share({
        title: title ?? '棋譜',
        message: url,
      });
    } catch {
      // User cancelled or share not supported — ignore
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.btnDisabled]}
      onPress={handleShare}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>共有</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    borderColor: '#ccc',
  },
  text: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#ccc',
  },
});
