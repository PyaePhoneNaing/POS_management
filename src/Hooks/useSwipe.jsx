import { useEffect } from "react";

export function useSwipe(onSwipeLeft, isActive = true, threshold = 50, ref) {
  useEffect(() => {
    if (!isActive || !ref?.current) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > threshold) {
        onSwipeLeft();
      }
    };

    const element = ref.current;
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, isActive, threshold, ref]);
}
