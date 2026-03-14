import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GestureDetector } from 'react-native-gesture-handler';
import ShogiBoard from '@/components/board/ShogiBoard';
import Hand from '@/components/board/Hand';
import PlayerControls from '@/components/controls/PlayerControls';
import KifuList from '@/components/kifu/KifuList';
import BranchIndicator from '@/components/kifu/BranchIndicator';
import { useKifuPlayer } from '@/hooks/useKifuPlayer';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { COLORS } from '@/lib/shogi/constants';

export default function MainScreen() {
  const router = useRouter();
  const {
    board,
    sentePieces,
    gotePieces,
    moveDescription,
    currentMove,
    totalMoves,
    lastMove,
    isLoaded,
    kifuList,
    branchMoves,
    goForward,
    goBack,
    goToStart,
    goToEnd,
    goTo,
    forkAndForward,
  } = useKifuPlayer();
  const { layout, boardSize } = useScreenLayout();

  const swipeGesture = useSwipeGesture(goForward, goBack);
  useKeyboardShortcuts({
    onForward: goForward,
    onBack: goBack,
    onStart: goToStart,
    onEnd: goToEnd,
  });

  const isLandscape = layout === 'landscape' || layout === 'tablet';

  const controls = (
    <PlayerControls
      currentMove={currentMove}
      totalMoves={totalMoves}
      onStart={goToStart}
      onBack={goBack}
      onForward={goForward}
      onEnd={goToEnd}
      onGoTo={goTo}
      isLoaded={isLoaded}
    />
  );

  const importBtn = (
    <TouchableOpacity style={styles.importBtn} onPress={() => router.push('/import')}>
      <Text style={styles.importBtnText}>棋譜を読む</Text>
    </TouchableOpacity>
  );

  const kifuSection = (
    <>
      <BranchIndicator branches={branchMoves} onSelectBranch={forkAndForward} />
      <KifuList moves={kifuList} currentMove={currentMove} onGoTo={goTo} />
    </>
  );

  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.landscapeContainer}>
          {/* Left: hands + board + controls */}
          <View style={styles.landscapeBoardArea}>
            <Hand player="gote" pieces={gotePieces} pieceSize={boardSize / 9} />
            <GestureDetector gesture={swipeGesture}>
              <View>
                <ShogiBoard board={board} size={boardSize} lastMove={lastMove} />
              </View>
            </GestureDetector>
            <Hand player="sente" pieces={sentePieces} pieceSize={boardSize / 9} />
            <MoveDescription text={moveDescription} />
            {controls}
            <View style={styles.importRow}>{importBtn}</View>
          </View>
          {/* Right: kifu list */}
          <View style={styles.landscapeSide}>
            {kifuSection}
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
        <GestureDetector gesture={swipeGesture}>
          <View>
            <ShogiBoard board={board} size={boardSize} lastMove={lastMove} />
          </View>
        </GestureDetector>
        <Hand player="sente" pieces={sentePieces} pieceSize={boardSize / 9} />
        <MoveDescription text={moveDescription} />
        {controls}
        <View style={styles.importRow}>{importBtn}</View>
        {kifuSection}
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
    borderLeftWidth: 1,
    borderLeftColor: COLORS.boardLine,
    overflow: 'hidden',
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
  importRow: {
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  importBtn: {
    height: 40,
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
});
