'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ColumnsProps,
  CustomTable,
  CustomTableProps,
  RowsProps,
} from '../custom/custom-table';
import { ImageUrlsProps } from '@/utils/img-urls';
import { CustomImage } from '../custom/custom-image';

export type SelectableTableColumnKeysProps<ColumnKeysProps> =
  | 'ID'
  | ColumnKeysProps
  | 'ACTIONS';

type SelectableTableProps<ColumnKeysProps> = {
  rows: CustomTableProps<ColumnKeysProps>['rows'];
  columns: CustomTableProps<ColumnKeysProps>['columns'];
  onEndReached?: CustomTableProps<
    SelectableTableColumnKeysProps<ColumnKeysProps>
  >['onEndReached'];
  getSelectedRows?: (selectedRows: RowsProps<ColumnKeysProps>) => void;
};

const SelectIcon = function <ColumnKeysProps>({
  id,
  row,
  selectedRows,
  setSelectedRows,
}: {
  id: number;
  row: RowsProps<ColumnKeysProps>[0];
  selectedRows: RowsProps<ColumnKeysProps>;
  setSelectedRows: Dispatch<SetStateAction<RowsProps<ColumnKeysProps>>>;
}) {
  const selected = selectedRows.find(
    (selectedRow) => (selectedRow as any).ID === id,
  );
  const icon = (selected ? 'CHECK_ICON' : 'PLUS_ICON') as ImageUrlsProps;
  const handleSelect = () => setSelectedRows([...(selectedRows || []), row]);

  return (
    <div className="flex justify-center items-center cursor-pointer w-6 h-8">
      <CustomImage
        imageKey={icon}
        width={25}
        height={25}
        onClick={handleSelect}
      />
    </div>
  );
};

export function SelectableTable<ColumnKeysProps>({
  columns: _columns,
  rows: _rows,
  onEndReached,
  getSelectedRows,
}: SelectableTableProps<ColumnKeysProps>) {
  const [selectedRows, setSelectedRows] = useState<
    RowsProps<SelectableTableColumnKeysProps<ColumnKeysProps>>
  >([]);

  const mapRows = (rows: RowsProps<ColumnKeysProps>) => {
    return rows.map((row, index) => {
      const id = (row as any)?.ID || ++index;
      return {
        ID: id,
        ...row,
        ACTIONS: (
          <SelectIcon
            id={id}
            row={row}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        ),
      };
    });
  };

  const [rows, setRows] = useState(mapRows(_rows));

  const getMergedRows = (
    rows: CustomTableProps<
      SelectableTableColumnKeysProps<ColumnKeysProps>
    >['rows'],
  ) => {
    const selectedExcludedRows = rows.filter(
      (row) => !selectedRows.some((selectedRow) => selectedRow.ID === row.ID),
    );

    const mergedRows = mapRows([...selectedRows, ...selectedExcludedRows]);
    return mergedRows;
  };

  useEffect(() => {
    const mergedRows = getMergedRows(
      _rows as CustomTableProps<
        SelectableTableColumnKeysProps<ColumnKeysProps>
      >['rows'],
    );

    setRows(mergedRows.length ? mergedRows : mapRows(_rows));
  }, [_rows]); // Re-execute the rows in case the "_rows" prop changes (e.g. when the rows are being fetched)

  const columns: ColumnsProps<SelectableTableColumnKeysProps<ColumnKeysProps>> =
    [
      { label: '#', id: 'ID', minWidth: 30 },
      ..._columns,
      { label: '', id: 'ACTIONS', align: 'center', minWidth: 30 },
    ];

  useEffect(() => {
    const mergedRows = getMergedRows(rows);

    getSelectedRows?.(selectedRows);
    setRows(mergedRows);
  }, [selectedRows]);

  return (
    <CustomTable<ColumnKeysProps>
      rows={rows}
      columns={columns as ColumnsProps<ColumnKeysProps>}
      onEndReached={onEndReached}
      height={310}
      elevation={0}
      className="flex flex-col min-h-[50vh] sm:min-h-[35vh]"
    />
  );
}
