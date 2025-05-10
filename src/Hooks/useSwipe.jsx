import { useEffect } from "react";

export function useSwipe(onSwipeLeft, isActive = true, threshold = 50) {
  useEffect(() => {
    if (!isActive) return;

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

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, isActive, threshold]);
}
