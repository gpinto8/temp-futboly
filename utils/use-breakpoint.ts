import { useEffect, useState } from 'react';

const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakPoint] = useState<keyof typeof tailwindBreakpoints | ''>('');
  const [windowSize, setWindowSize] = useState<any>({ width: undefined, height: undefined });

  const handleResize = () => {
    setWindowSize({
      width: window?.innerWidth || 0,
      height: window?.innerHeight || 0,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    if (0 < windowSize.width && windowSize.width < tailwindBreakpoints.sm) {
      setBreakPoint('sm');
    } else if (
      tailwindBreakpoints.sm < windowSize.width &&
      windowSize.width < tailwindBreakpoints.md
    ) {
      setBreakPoint('md');
    } else if (
      tailwindBreakpoints.md < windowSize.width &&
      windowSize.width < tailwindBreakpoints.lg
    ) {
      setBreakPoint('lg');
    } else if (
      tailwindBreakpoints.lg < windowSize.width &&
      windowSize.width < tailwindBreakpoints.md
    ) {
      setBreakPoint('xl');
    } else if (windowSize.width >= tailwindBreakpoints.md) {
      setBreakPoint('2xl');
    } else setBreakPoint('');

    return () => window.removeEventListener('resize', handleResize);
  }, [windowSize.width]);

  return breakpoint;
};
