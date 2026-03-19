import { useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/lib/shogi/constants';

interface PlayerControlsProps {
  currentMove: number;
  totalMoves: number;
  onStart: () => void;
  onBack: () => void;
  onForward: () => void;
  onEnd: () => void;
  isLoaded: boolean;
}

function haptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function PlayerControls({
  currentMove,
  totalMoves,
  onStart,
  onBack,
  onForward,
  onEnd,
  isLoaded,
}: PlayerControlsProps) {
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (!isLoaded || autoplayRef.current) return;
    autoplayRef.current = setInterval(() => {
      onForward();
    }, 700);
  }, [isLoaded, onForward]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const wrap = useCallback(
    (fn: () => void) => () => {
      if (!isLoaded) return;
      haptic();
      fn();
    },
    [isLoaded]
  );

  const opacity = isLoaded ? 1 : 0.4;

  return (
    <View style={styles.container}>
      {/* Move counter */}
      <Text style={styles.counter}>
        {currentMove} / {totalMoves} 手
      </Text>

      {/* Navigation buttons */}
      <View style={[styles.btnRow, { opacity }]}>
        <NavBtn label="⏮" onPress={wrap(onStart)} />
        <NavBtn label="◁" onPress={wrap(onBack)} />

        {/* Forward button with long-press autoplay */}
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={wrap(onForward)}
          onLongPress={startAutoplay}
          onPressOut={stopAutoplay}
          delayLongPress={400}
        >
          <Text style={styles.btnText}>▷</Text>
        </Pressable>

        <NavBtn label="⏭" onPress={wrap(onEnd)} />
      </View>
    </View>
  );
}

function NavBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={onPress}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.bgMain,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  counter: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMain,
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  btn: {
    width: 56,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    backgroundColor: COLORS.primaryLight,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
