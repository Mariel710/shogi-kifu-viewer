import { Gesture } from 'react-native-gesture-handler';

/**
 * Returns a horizontal pan gesture that calls onForward (left swipe)
 * or onBack (right swipe) when the user swipes across the board.
 */
export function useSwipeGesture(onForward: () => void, onBack: () => void) {
  return Gesture.Pan()
    .activeOffsetX([-30, 30])  // activate only after 30px horizontal movement
    .failOffsetY([-15, 15])    // cancel if vertical movement exceeds 15px (scroll)
    .runOnJS(true)
    .onEnd((e) => {
      if (e.translationX < -30) onForward();
      else if (e.translationX > 30) onBack();
    });
}
