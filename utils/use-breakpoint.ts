import { useEffect, useState } from 'react';

const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type TailwindBreakpointsProps = keyof typeof tailwindBreakpoints | '';

const betweenOf = (value: number, a: number, b: number) => value >= a && value <= b;

const getViewportBreakpoint = (viewportWidth: number): TailwindBreakpointsProps => {
  const { sm, md, lg, xl } = tailwindBreakpoints;

  if (betweenOf(viewportWidth, 0, sm)) {
    return 'sm';
  } else if (betweenOf(viewportWidth, sm, md)) {
    return 'md';
  } else if (betweenOf(viewportWidth, md, lg)) {
    return 'lg';
  } else if (betweenOf(viewportWidth, lg, xl)) {
    return 'xl';
  } else if (betweenOf(viewportWidth, xl, tailwindBreakpoints['2xl'])) {
    return '2xl';
  } else return '';
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakPoint] = useState<TailwindBreakpointsProps>(
    getViewportBreakpoint(innerWidth)
  );
  const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({
    width: 0,
    height: 0,
  });

  const handleResize = () => setWindowSize({ width: innerWidth, height: innerHeight });

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    if (windowSize.width) {
      const breakpoint = getViewportBreakpoint(windowSize.width);
      setBreakPoint(breakpoint);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [windowSize.width]);

  return breakpoint;
};
