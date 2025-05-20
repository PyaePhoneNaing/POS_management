import { useState, useEffect } from 'react';
export default function useIsLaptop() {
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isLaptop;
}
