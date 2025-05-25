import { useDrag } from '@use-gesture/react';

export function useSwipe(onSwipeLeft, isActive = true, threshold = 50, ref) {
  useDrag(
    ({ down, movement: [mx] }) => {
      if (!down && isActive && mx < -threshold) {
        onSwipeLeft();
      }
    },
    {
      target: ref,
      eventOptions: { passive: false },
      enabled: isActive,
      axis: 'x',
      filterTaps: true,
    }
  );
}
