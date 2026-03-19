import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GestureDetector } from 'react-native-gesture-handler';
import ShogiBoard from '@/components/board/ShogiBoard';
import Hand from '@/components/board/Hand';
import PlayerControls from '@/components/controls/PlayerControls';
import KifuList from '@/components/kifu/KifuList';
import BranchIndicator from '@/components/kifu/BranchIndicator';
import GameInfoBar from '@/components/header/GameInfoBar';
import CommentView from '@/components/kifu/CommentView';
import ShareButton from '@/components/share/ShareButton';
import { useKifuPlayerContext } from '@/contexts/KifuPlayerContext';
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
    comments,
    meta,
    goForward,
    goBack,
    goToStart,
    goToEnd,
    goTo,
    forkAndForward,
    getJkfJson,
  } = useKifuPlayerContext();
  const { layout, boardSize } = useScreenLayout();
  const [reversed, setReversed] = useState(false);

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
      isLoaded={isLoaded}
    />
  );

  const importBtn = (
    <TouchableOpacity style={styles.importBtn} onPress={() => router.push('/import')}>
      <Text style={styles.importBtnText}>棋譜を読む</Text>
    </TouchableOpacity>
  );

  const shareBtn = (
    <ShareButton getJkfJson={getJkfJson} title="棋譜" disabled={!isLoaded} />
  );

  const flipBtn = (
    <TouchableOpacity
      style={[styles.flipBtn, reversed && styles.flipBtnActive]}
      onPress={() => setReversed((v) => !v)}
    >
      <Text style={[styles.flipBtnText, reversed && styles.flipBtnTextActive]}>後手視点</Text>
    </TouchableOpacity>
  );

  const kifuSection = (
    <>
      <BranchIndicator branches={branchMoves} onSelectBranch={forkAndForward} />
      <KifuList moves={kifuList} currentMove={currentMove} onGoTo={goTo} />
    </>
  );

  const boardArea = (
    <>
      <Hand player={reversed ? 'sente' : 'gote'} pieces={gotePieces} pieceSize={boardSize / 9} />
      <GestureDetector gesture={swipeGesture}>
        <View>
          <ShogiBoard board={board} size={boardSize} lastMove={lastMove} reversed={reversed} />
        </View>
      </GestureDetector>
      <Hand player={reversed ? 'gote' : 'sente'} pieces={sentePieces} pieceSize={boardSize / 9} />
    </>
  );

  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <GameInfoBar meta={meta} isLoaded={isLoaded} />
        <View style={styles.landscapeContainer}>
          {/* Left: hands + board + controls — ScrollView allows overflow on small screens */}
          <ScrollView
            style={styles.landscapeBoardScroll}
            contentContainerStyle={styles.landscapeBoardArea}
            showsVerticalScrollIndicator={false}
          >
            {boardArea}
            <MoveDescription text={moveDescription} />
            {controls}
            <View style={styles.actionRow}>
              {importBtn}
              {flipBtn}
              {shareBtn}
            </View>
            <CommentView comments={comments} />
          </ScrollView>
          {/* Right: kifu list */}
          <View style={styles.landscapeSide}>
            {kifuSection}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Portrait layout — no ScrollView; all elements fit within screen height
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <GameInfoBar meta={meta} isLoaded={isLoaded} />
      <View style={styles.portraitContainer}>
        {/* 後手持駒 */}
        <Hand player={reversed ? 'sente' : 'gote'} pieces={gotePieces} pieceSize={boardSize / 9} />

        {/* 将棋盤 */}
        <GestureDetector gesture={swipeGesture}>
          <View style={styles.boardWrapper}>
            <ShogiBoard board={board} size={boardSize} lastMove={lastMove} reversed={reversed} />
          </View>
        </GestureDetector>

        {/* 先手持駒 */}
        <Hand player={reversed ? 'gote' : 'sente'} pieces={sentePieces} pieceSize={boardSize / 9} />

        {/* 手数表示 + 操作ボタン類を1行に統合 */}
        <View style={styles.descActionRow}>
          <Text style={styles.moveDescText} numberOfLines={1}>{moveDescription}</Text>
          {importBtn}
          {flipBtn}
        </View>

        {/* ナビゲーションボタン */}
        {controls}

        {/* 棋譜リスト — 残りスペースを全て使用 */}
        <View style={styles.kifuListArea}>
          <BranchIndicator branches={branchMoves} onSelectBranch={forkAndForward} />
          <KifuList moves={kifuList} currentMove={currentMove} onGoTo={goTo} />
        </View>
      </View>
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
  portraitContainer: {
    flex: 1,
    alignItems: 'center',
  },
  boardWrapper: {
    // No extra style needed — board controls its own size
  },
  descActionRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0EAD6',
    gap: 6,
  },
  moveDescText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  kifuListArea: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeBoardScroll: {
    flexShrink: 0,
  },
  landscapeBoardArea: {
    alignItems: 'center',
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
  actionRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
    gap: 8,
  },
  importBtn: {
    height: 32,
    paddingHorizontal: 10,
    backgroundColor: '#8B6914',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  flipBtn: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipBtnActive: {
    backgroundColor: COLORS.primary,
  },
  flipBtnText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  flipBtnTextActive: {
    color: '#fff',
  },
});
