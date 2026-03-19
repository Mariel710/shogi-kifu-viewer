import { View, StyleSheet } from 'react-native';
import type { BoardState } from '@/lib/shogi/types';
import { COLORS } from '@/lib/shogi/constants';
import Square from './Square';
import type { HighlightType } from './Square';
import Piece from './Piece';
import Coordinates from './Coordinates';

interface LastMove {
  from?: { row: number; col: number };
  to: { row: number; col: number };
}

interface ShogiBoardProps {
  board: BoardState;
  size: number; // total board size in px (square: size × size)
  lastMove?: LastMove;
  reversed?: boolean; // true = gote perspective
}

export default function ShogiBoard({
  board,
  size,
  lastMove,
  reversed = false,
}: ShogiBoardProps) {
  const coordSize = size * 0.06; // ~6% of board for coordinate labels
  const squareSize = (size - coordSize) / 9;

  function getHighlight(row: number, col: number): HighlightType {
    if (!lastMove) return 'none';
    if (lastMove.to.row === row && lastMove.to.col === col) return 'lastTo';
    if (
      lastMove.from &&
      lastMove.from.row === row &&
      lastMove.from.col === col
    )
      return 'lastFrom';
    return 'none';
  }

  // When reversed, we flip the display order of rows and columns
  const rowIndices = reversed
    ? [8, 7, 6, 5, 4, 3, 2, 1, 0]
    : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const colIndices = reversed
    ? [8, 7, 6, 5, 4, 3, 2, 1, 0]
    : [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <View style={{ width: size, height: size + coordSize }}>
      {/* Coordinate labels */}
      <Coordinates squareSize={squareSize} coordSize={coordSize} reversed={reversed} />

      {/* Board grid — offset by coordSize to leave room for rank labels on right */}
      <View
        style={[
          styles.board,
          {
            width: squareSize * 9,
            height: squareSize * 9,
            marginTop: coordSize,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderColor: COLORS.boardLine,
          },
        ]}
      >
        {rowIndices.map((row) => (
          <View key={row} style={styles.row}>
            {colIndices.map((col) => {
              const piece = board[row][col];
              return (
                <Square key={col} size={squareSize} highlight={getHighlight(row, col)}>
                  {piece && (
                    <Piece type={piece.type} player={piece.player} size={squareSize} />
                  )}
                </Square>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: COLORS.boardBg,
  },
  row: {
    flexDirection: 'row',
  },
});
