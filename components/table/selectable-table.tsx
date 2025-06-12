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
  | 'INDEX'
  | 'ID'
  | ColumnKeysProps
  | 'ACTIONS'
  | 'METADATA';

type SelectableTableProps<ColumnKeysProps> = {
  rows: CustomTableProps<ColumnKeysProps>['rows'];
  columns: CustomTableProps<ColumnKeysProps>['columns'];
  onEndReached?: CustomTableProps<
    SelectableTableColumnKeysProps<ColumnKeysProps>
  >['onEndReached'];
  initialSelectedRows?: RowsProps<ColumnKeysProps>;
  getSelectedRows?: (selectedRows: RowsProps<ColumnKeysProps>) => void;
  singleSelection?: boolean;
  avoidReorder?: boolean;
  avoidEndReload?: boolean;
  resetTable?: number; // Reset it with "Math.random()" to trigger the useEffect hook
};

const SelectIcon = function <ColumnKeysProps>({
  row,
  selectedRows,
  setSelectedRows,
  singleSelection,
}: {
  row: RowsProps<SelectableTableColumnKeysProps<ColumnKeysProps>>[0];
  selectedRows: RowsProps<ColumnKeysProps>;
  setSelectedRows: Dispatch<SetStateAction<RowsProps<ColumnKeysProps>>>;
  singleSelection: boolean;
}) {
  const selected = selectedRows.find(
    (selectedRow) => (selectedRow as any).ID === row.ID,
  );
  const icon = (selected ? 'CHECK_ICON' : 'PLUS_ICON') as ImageUrlsProps;
  const handleSelect = () => {
    // If its already selected, remove it
    const currentRowId: any = row.ID;
    const isAlreadyIncluded = selectedRows.some(
      (row: any) => row.ID === currentRowId,
    );
    if (currentRowId && isAlreadyIncluded) {
      const filteredRows = selectedRows.filter(
        (row: any) => row.ID !== currentRowId,
      );
      setSelectedRows([...filteredRows]);
      return;
    }

    if (singleSelection) setSelectedRows([row]); // Single-selection
    else setSelectedRows([...(selectedRows || []), row]); // Multi-selection
  };

  const notAllowed = row?.METADATA?.notAllowed;

  return (
    <div
      className={`flex justify-center items-center w-6 h-8 ${
        notAllowed ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <CustomImage
        imageKey={icon}
        width={25}
        height={25}
        onClick={!notAllowed ? handleSelect : undefined}
      />
    </div>
  );
};

export function SelectableTable<ColumnKeysProps>({
  columns: _columns,
  rows: _rows,
  onEndReached,
  avoidEndReload,
  initialSelectedRows,
  getSelectedRows,
  singleSelection,
  avoidReorder,
  resetTable,
}: SelectableTableProps<ColumnKeysProps>) {
  const mapRows = (rows: RowsProps<ColumnKeysProps>) =>
    rows.map((row, i) => {
      const index = (row as any)?.INDEX || ++i;
      return {
        INDEX: index,
        ...row,
        ACTIONS: (
          <SelectIcon
            row={
              row as RowsProps<
                SelectableTableColumnKeysProps<ColumnKeysProps>
              >[0]
            }
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            singleSelection={!!singleSelection}
          />
        ),
      };
    }) as RowsProps<SelectableTableColumnKeysProps<ColumnKeysProps>>;

  const [selectedRows, setSelectedRows] = useState<
    RowsProps<SelectableTableColumnKeysProps<ColumnKeysProps>>
  >([]);
  const [rows, setRows] = useState(mapRows(_rows));

  const columns: ColumnsProps<SelectableTableColumnKeysProps<ColumnKeysProps>> =
    [
      { label: '#', id: 'INDEX', minWidth: 30 },
      { label: 'ID', id: 'ID', minWidth: 50 },
      ..._columns,
      { label: '', id: 'ACTIONS', align: 'center', minWidth: 30 },
    ];

  const getMergedRows = (
    rows: CustomTableProps<
      SelectableTableColumnKeysProps<ColumnKeysProps>
    >['rows'],
  ) => {
    if (avoidReorder) return mapRows([...rows]);

    const selectedExcludedRows = rows.filter(
      (row) => !selectedRows.some((selectedRow) => selectedRow.ID === row.ID),
    );
    const newSelectedRows = selectedRows.map((selectedRow) => ({
      ...selectedRow,
      INDEX: '', // The selected rows dont need the index numeration (otherwise we could get double indexation (e.g 1,2,3 and then 1,2,3 below ..))
    }));
    const mergedRows = mapRows([...newSelectedRows, ...selectedExcludedRows]);
    return mergedRows;
  };

  useEffect(() => {
    const mergedRows = getMergedRows(
      _rows as CustomTableProps<
        SelectableTableColumnKeysProps<ColumnKeysProps>
      >['rows'],
    );

    setRows(mergedRows?.length ? mergedRows : mapRows(_rows));
  }, [_rows]); // Re-execute the rows in case the "_rows" prop changes (e.g. when the rows are being fetched)

  useEffect(() => {
    const mergedRows = getMergedRows(rows);

    getSelectedRows?.(selectedRows);
    setRows(mergedRows);
  }, [selectedRows]);

  useEffect(() => {
    if (initialSelectedRows?.length) {
      setSelectedRows(mapRows(initialSelectedRows));
    }
  }, [initialSelectedRows]);

  useEffect(() => setSelectedRows([]), [resetTable]);

  return (
    <CustomTable<ColumnKeysProps>
      rows={rows}
      columns={columns as ColumnsProps<ColumnKeysProps>}
      onEndReached={onEndReached}
      avoidEndReload={avoidEndReload}
      height={310}
      elevation={0}
      className="flex flex-col min-h-[50vh] sm:min-h-[35vh]"
    />
  );
}
