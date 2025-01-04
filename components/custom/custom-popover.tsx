import Popover, { PopoverProps } from '@mui/material/Popover';
import { CustomImage } from './custom-image';
import React from 'react';

type CustomPopoverProps = {
  children: React.ReactNode;
  titleComponent?: React.JSX.Element;
} & PopoverProps;

export const CustomPopover = ({
  children,
  titleComponent,
  ...props
}: CustomPopoverProps) => {
  return (
    <Popover {...(props as any)}>
      <div className="!p-4">
        <div
          className={`flex w-full items-baseline ${
            !!titleComponent ? 'justify-between' : 'justify-end '
          }`}
        >
          {titleComponent}
          <CustomImage
            imageKey="CLOSE_ICON"
            className="h-4 w-4 cursor-pointer"
            width={16}
            height={16}
            onClick={() => props?.onClose?.({}, 'backdropClick')}
          />
        </div>
        {children}
      </div>
    </Popover>
  );
};
