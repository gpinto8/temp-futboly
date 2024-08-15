import React, { useCallback } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const CustomScrollbar = React.forwardRef(({ children, className, style }: any, ref) => {
  // const refSetter = useCallback(
  //   (scrollbarsRef: any) => {
  //     if (scrollbarsRef && ref?.current) {
  //       ref.current = scrollbarsRef.osInstance().getElements().viewport;
  //     }
  //   },
  //   [ref]
  // );

  return (
    <OverlayScrollbarsComponent className={className} style={style}>
      {children}
    </OverlayScrollbarsComponent>
  );
});

export default CustomScrollbar;
