import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ShogiBoard from '@/components/board/ShogiBoard';
import Hand from '@/components/board/Hand';
import { useKifuPlayer } from '@/hooks/useKifuPlayer';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { COLORS } from '@/lib/shogi/constants';

export default function MainScreen() {
  const router = useRouter();
  const {
    board,
    sentePieces,
    gotePieces,
    moveDescription,
    goForward,
    goBack,
    goToStart,
    goToEnd,
  } = useKifuPlayer();
  const { layout, boardSize } = useScreenLayout();

  const isLandscape = layout === 'landscape' || layout === 'tablet';

  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.landscapeContainer}>
          {/* Left: hands + board */}
          <View style={styles.landscapeBoardArea}>
            <Hand player="gote" pieces={gotePieces} pieceSize={boardSize / 9} />
            <ShogiBoard board={board} size={boardSize} />
            <Hand player="sente" pieces={sentePieces} pieceSize={boardSize / 9} />
            <MoveDescription text={moveDescription} />
            <Controls
              onStart={goToStart}
              onBack={goBack}
              onForward={goForward}
              onEnd={goToEnd}
              onImport={() => router.push('/import')}
            />
          </View>
          {/* Right: kifu list placeholder */}
          <View style={styles.landscapeSide}>
            <Text style={styles.sideTitle}>棋譜リスト</Text>
            <Text style={styles.sidePlaceholder}>Phase 5で実装</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Portrait layout
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.portraitContent}
        showsVerticalScrollIndicator={false}
      >
        <Hand player="gote" pieces={gotePieces} pieceSize={boardSize / 9} />
        <ShogiBoard board={board} size={boardSize} />
        <Hand player="sente" pieces={sentePieces} pieceSize={boardSize / 9} />
        <MoveDescription text={moveDescription} />
        <Controls
          onStart={goToStart}
          onBack={goBack}
          onForward={goForward}
          onEnd={goToEnd}
          onImport={() => router.push('/import')}
        />
        {/* Kifu list placeholder */}
        <View style={styles.kifuPlaceholder}>
          <Text style={styles.sideTitle}>棋譜リスト</Text>
          <Text style={styles.sidePlaceholder}>Phase 5で実装</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MoveDescription({ text }: { text: string }) {
  return (
    <View style={styles.moveDescRow}>
      <Text style={styles.moveDescText}>{text}</Text>
    </View>
  );
}

interface ControlsProps {
  onStart: () => void;
  onBack: () => void;
  onForward: () => void;
  onEnd: () => void;
  onImport: () => void;
}

function Controls({ onStart, onBack, onForward, onEnd, onImport }: ControlsProps) {
  return (
    <View style={styles.controlRow}>
      <CtrlBtn label="|◁" onPress={onStart} />
      <CtrlBtn label="◁" onPress={onBack} />
      <CtrlBtn label="▷" onPress={onForward} />
      <CtrlBtn label="▷|" onPress={onEnd} />
      <TouchableOpacity style={styles.importBtn} onPress={onImport}>
        <Text style={styles.importBtnText}>棋譜を読む</Text>
      </TouchableOpacity>
    </View>
  );
}

function CtrlBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.ctrlBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.ctrlBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scroll: {
    flex: 1,
  },
  portraitContent: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeBoardArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  landscapeSide: {
    flex: 1,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.boardLine,
  },
  moveDescRow: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    backgroundColor: '#F0EAD6',
  },
  moveDescText: {
    fontSize: 15,
    color: COLORS.textMain,
    fontWeight: '500',
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 6,
    backgroundColor: COLORS.bgMain,
  },
  ctrlBtn: {
    width: 52,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  importBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#8B6914',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  kifuPlaceholder: {
    alignSelf: 'stretch',
    padding: 16,
    marginTop: 8,
    backgroundColor: '#F5F0E8',
    minHeight: 120,
  },
  sideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  sidePlaceholder: {
    fontSize: 13,
    color: '#999',
  },
});
