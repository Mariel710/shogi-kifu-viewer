import { TouchableOpacity, Text, StyleSheet, Platform, Share } from 'react-native';
import { COLORS } from '@/lib/shogi/constants';

interface ShareButtonProps {
  jkfData: string;
  title?: string;
  disabled?: boolean;
}

export default function ShareButton({ jkfData, title, disabled }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({ title: title ?? '棋譜', text: jkfData });
        } else {
          await navigator.clipboard.writeText(jkfData);
        }
        return;
      }

      await Share.share({
        title: title ?? '棋譜',
        message: jkfData,
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
