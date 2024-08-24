import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Virtuoso } from 'react-virtuoso';
import { Loader } from '../loader';

// @ts-ignore
export type RowsProps<T> = { [key in T]: any }[];
export type ColumnsProps<T> = {
  id: T;
  label: string;
  minWidth: number;
  align?: 'center' | 'left' | 'right';
  className?: string;
}[];

type CustomTableProps<ColumnsKeys> = {
  rows: RowsProps<ColumnsKeys>;
  columns: ColumnsProps<ColumnsKeys>;
  className?: string;
  height?: number;
  width?: number;
  maxHeight?: number;
  maxWidth?: number;
  customizeRows?: {
    className?: string;
    hideHorizontalLine?: boolean;
  };
  customizeColumns?: {
    className?: string;
  };
  onEndReached?: () => void;
  elevation?: number;
};

export function CustomTable<ColumnKeysProps>({
  rows,
  columns,
  className = '',
  height,
  width,
  maxHeight,
  maxWidth,
  customizeRows = {},
  customizeColumns = {},
  onEndReached,
  elevation,
}: CustomTableProps<ColumnKeysProps>) {
  const TableRow = ({
    row,
    className,
    isHeader,
  }: {
    row?: any;
    className?: string;
    isHeader?: boolean;
  }) => {
    const toPixel = (value?: number) => value && `${value}px`;
    const containerClassName = isHeader ? ' font-bold pt-2' : '';
    return (
      <div className={`flex w-full gap-2 pb-2 items-center justify-between ${containerClassName} `}>
        {columns.map(({ id, label, align = 'left', minWidth }, index) => {
          let classes = `text-black line-clamp-1`;
          if (className) classes += ' ' + className;
          if (align === 'center') classes += ' flex justify-center items-center';
          if (align === 'left') classes += ' flex items-start justify-start';
          if (align === 'right') classes += ' flex items-end justify-end';

          return (
            <div
              key={index + Math.random()}
              className={classes}
              style={{
                ...(minWidth ? { minWidth: toPixel(minWidth), width: 'fit-content' } : {}),
              }}
            >
              {(row ? row[id] : label) || '-'}
            </div>
          );
        })}
      </div>
    );
  };

  const Header = () => {
    const className = 'font-bold ' + customizeColumns?.className || '';
    return <TableRow className={className} isHeader />;
  };

  const Footer = () =>
    typeof onEndReached === 'function' && (
      <div className="mt-5 flex justify-center items-center">
        <Loader color="main" />
      </div>
    );

  const getRows = (_: number, row: any) => {
    let className = customizeRows?.hideHorizontalLine ? 'border-none ' : '';
    className += customizeRows?.className || '';

    return <TableRow row={row} className={className} />;
  };

  const [once, setOnce] = useState(0);
  const endReached = (items: number) => {
    if (once === items) return; // This is a fix since the "endReached" functions gets called multiple times for some reason
    setOnce(items);

    onEndReached?.();
  };

  const newHeight = height ? `${height}px` : '100%';
  const newMaxHeight = maxHeight ? `${maxHeight}px` : '100%';
  const newMaxWidth = maxWidth ? `${maxWidth}px` : '100%';
  const newWidth = width ? `${width}px` : '100%';
  const newElevation = elevation ?? 1;

  return (
    <Paper
      className="w-full h-full"
      style={{
        height: newHeight,
        width: newWidth,
        maxHeight: newMaxHeight,
        maxWidth: newMaxWidth,
      }}
      elevation={newElevation}
    >
      <Virtuoso
        data={rows}
        className={`w-full h-full ${className}`}
        style={{
          height: newHeight,
          width: newWidth,
          maxHeight: newMaxHeight,
          maxWidth: newMaxWidth,
        }}
        itemContent={getRows}
        endReached={endReached}
        components={{ Footer, Header }}
      />
    </Paper>
  );
}
