// TODO: Phase 3 - implement kifu player hook
// Manages board state, current move index, and playback controls

export function useKifuPlayer() {
  return {
    currentMove: 0,
    totalMoves: 0,
    goForward: () => {},
    goBack: () => {},
    goToStart: () => {},
    goToEnd: () => {},
    goTo: (_move: number) => {},
  };
}
