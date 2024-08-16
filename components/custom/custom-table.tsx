import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Virtuoso } from 'react-virtuoso';
import { Loader } from '../loader';

// @ts-ignore
export type RowsProps<T> = { [key in T]: any }[];
export type ColumnsProps<T> = {
  id: T;
  label: string;
  centered?: boolean;
  className?: string;
  width?: number;
}[];

type CustomTableProps<ColumnsKeys> = {
  rows: RowsProps<ColumnsKeys>;
  columns: ColumnsProps<ColumnsKeys>;
  className?: string;
  height?: number;
  customizeRows?: {
    className?: string;
    hideHorizontalLine?: boolean;
  };
  customizeColumns?: {
    className?: string;
  };
  onEndReached?: () => void;
  showLastChild?: boolean;
  elevation?: number;
};

export function CustomTable<ColumnKeysProps>({
  rows,
  columns,
  className = '',
  height,
  customizeRows = {},
  customizeColumns = {},
  onEndReached,
  elevation,
}: CustomTableProps<ColumnKeysProps>) {
  const TableRow = ({ row, className }: { row?: any; className?: string }) => {
    return (
      <div className="flex w-full gap-2 pb-2 items-center justify-center">
        {columns.map(({ id, label, centered, width }, index) => {
          let classes = 'w-full text-black line-clamp-1 ';
          if (className) classes += className;
          if (centered) classes += ' flex justify-center items-center';

          return (
            <div
              key={index + Math.random()}
              className={classes}
              style={{ ...(width ? { minWidth: width + 'px', width: 'fit-content' } : {}) }}
            >
              {row ? row[id] : label}
            </div>
          );
        })}
      </div>
    );
  };

  const Header = () => {
    const className = 'font-bold ' + customizeColumns?.className || '';
    return <TableRow className={className} />;
  };

  const Footer = () => (
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

  const newHeight = `${height || 400}px`;
  const newElevation = elevation ?? 1;

  return (
    <Paper style={{ height: newHeight, width: '100%' }} elevation={newElevation}>
      <Virtuoso
        data={rows}
        className={`w-full h-full ${className}`}
        style={{ height: newHeight }}
        itemContent={getRows}
        endReached={endReached}
        components={{ Footer, Header }}
      />
    </Paper>
  );
}
