import { animated, useSpring } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { useEffect } from 'react';
import  useIsLaptop from '../Hooks/useIsLaptop';
import SidebarContent from '../Components/SidebarContent';
import '../Styles/Sidebar.styles.scss';


export default function Sidebar({ isSidebarVisible, sidebarRef, onClose }) {
  const SIDEBAR_WIDTH = 272;
  const isLaptop = useIsLaptop();

  const [{ x }, api] = useSpring(() => ({ x: -SIDEBAR_WIDTH }));
  useEffect(() => {
    if (isLaptop) {
      api.start({ x: 0 });
    } else {
      api.start({ x: isSidebarVisible ? 0 : -SIDEBAR_WIDTH });
    }
  }, [isSidebarVisible, isLaptop, api]);

   

  const bind = useDrag(
    ({ down, movement: [mx], last, cancel }) => {
      if (!isSidebarVisible) return;
      const dragX = Math.min(mx, 0);
      api.start({ x: down ? dragX : 0, immediate: down });
      if (last && dragX < -SIDEBAR_WIDTH / 2) {
        api.start({ x: -SIDEBAR_WIDTH });
        if (onClose) onClose();
      } else if (last) {
        api.start({ x: 0 });
      }
    },
    { axis: 'x', filterTaps: true }
  );

  return (
    <animated.div
      {...(!isLaptop ? bind() : {})}
      ref={sidebarRef}
      className={`sidebar shadow-lg${isSidebarVisible ? ' visible' : ''}`}
      style={{
        transform: x.to((x) => `translateX(${x}px)`),
        touchAction: 'none',
      }}
      aria-hidden={!isSidebarVisible}
    >
      <SidebarContent onClose={onClose} />

      
    </animated.div>
  );
}