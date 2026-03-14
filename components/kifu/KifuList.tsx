import { useRef, useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { COLORS } from '@/lib/shogi/constants';
import type { KifuListItem } from '@/hooks/useKifuPlayer';

interface KifuListProps {
  moves: KifuListItem[];
  currentMove: number;
  onGoTo: (move: number) => void;
}

const ROW_HEIGHT = 36;

export default function KifuList({ moves, currentMove, onGoTo }: KifuListProps) {
  const listRef = useRef<FlatList<KifuListItem>>(null);

  // Auto-scroll to keep the current move visible
  useEffect(() => {
    if (moves.length === 0) return;
    const index = Math.min(currentMove, moves.length - 1);
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  }, [currentMove, moves.length]);

  const renderItem: ListRenderItem<KifuListItem> = useCallback(
    ({ item }) => {
      const isCurrent = item.move === currentMove;
      return (
        <TouchableOpacity
          style={[styles.row, isCurrent && styles.rowCurrent]}
          onPress={() => onGoTo(item.move)}
          activeOpacity={0.7}
        >
          <Text style={[styles.rowText, isCurrent && styles.rowTextCurrent]}>
            {item.description}
          </Text>
        </TouchableOpacity>
      );
    },
    [currentMove, onGoTo]
  );

  const keyExtractor = useCallback((item: KifuListItem) => String(item.move), []);

  const onScrollToIndexFailed = useCallback(
    (info: { index: number }) => {
      // Retry after layout has settled
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: Math.min(info.index, moves.length - 1),
          animated: false,
        });
      }, 100);
    },
    [moves.length]
  );

  if (moves.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={moves}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={onScrollToIndexFailed}
        showsVerticalScrollIndicator
        style={styles.list}
        getItemLayout={(_data, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    maxHeight: 220,
    borderTopWidth: 1,
    borderTopColor: COLORS.boardLine,
    backgroundColor: '#FAFAF5',
  },
  list: {
    flex: 1,
  },
  row: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0D8C8',
  },
  rowCurrent: {
    backgroundColor: '#FFEB3B55',
  },
  rowText: {
    fontSize: 13,
    color: COLORS.textMain,
  },
  rowTextCurrent: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
