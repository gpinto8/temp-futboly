import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

// type Sample = [string, number, number, number, number];

// const sample: readonly Sample[] = [
//   ['Frozen yoghurt', 159, 6.0, 24, 4.0],
//   ['Ice cream sandwich', 237, 9.0, 37, 4.3],
//   ['Eclair', 262, 16.0, 24, 6.0],
//   ['Cupcake', 305, 3.7, 67, 4.3],
//   ['Gingerbread', 356, 16.0, 49, 3.9],
// ];

// function createData(
//   id: number,
//   dessert: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number
// ): any {
//   // Data
//   return { id, dessert, calories, fat, carbs, protein };
// }

// const rowData = {
//   ACTIONS: ["Team1", "Team2", "Team3"],
//   USER: ["user1"],
// };
// const arrayToObject = (array: any[]) => array.reduce((a, v) => ({ ...a, [v]: v }), {});
// // console.log({ toObject: arrayToObject(rowData) });
// // console.log({ rowData });

// function transformRowData(rowData: any) {
//   const keys = Object.keys(rowData);
//   const maxLength = Math.max(...keys.map(key => rowData[key].length));

//   const rows = [];

//   for (let i = 0; i < maxLength; i++) {
//     const row = {};
//     // let previousKeyIndex: any = null;
//     keys.forEach(key => {
//       const wholeData = rowData[key];
//       // If the array is shorter than the max length, repeat the last element
//       const index = Math.min(i, wholeData.length - 1);
//       const value = wholeData[index];
//       console.log({ key, value, index });
//       // if (key + index === previousKeyIndex) return;
//       // console.log({ previousKeyIndex, ccc: key + index });
//       // previousKeyIndex = key + index;
//       row[key] = value;
//     });
//     rows.push(row);
//   }
//   console.log({ rows });

//   return rows;
// }
// console.log({ asdfas: transformRowData(rowData) });

// // Example usage:
// const rowData = {
//   ACTIONS: [2], // Adjusted to match the given desired output
//   USER: [1],
// };

// const rows: keyof typeof columns = null;
// console.log(rows);

// rowData.map(row => row. )

// transformRowData(rowData);
// type RowData = { [K in COLUMN_KEYS]: any }[]
// const rows: RowData = [{ ACTIONS: 1, INDEX: 1, TEAM: 1, USER: 1 }];
// { USER: 1, ACTIONS: 2 },
// { USER: 1, ACTIONS: 2 },
// { USER: 1, ACTIONS: 2 },
// { USER: 1, ACTIONS: 2 },
// ];
// console.log({ rows });

// const rows: any /*Data[]*/ = Array.from({ length: 200 }, (_, index) => {
//   // const randomSelection = sample[Math.floor(Math.random() * sample.length)];
//   // return createData(index, ...randomSelection);
//   const keys = Object.values(columns).map(column => column.id);

//   const arrayToObject = (array: any[]) => array.reduce((a, v) => ({ ...a, [v]: v }), {});
//   const result = arrayToObject(keys);

//   console.log({ result });

//   return result;
// });

const VirtuosoTableComponents = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props: any) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

// type COLUMN_KEYS = 'INDEX' | 'USER' | 'TEAM' | 'ACTIONS';
// interface ColumnData {
//   id: COLUMN_KEYS;
//   label: string;
// }

// @ts-ignore
export type RowsProps<T> = { [key in T]: any }[];
export type ColumnsProps<T> = { id: T; label: string; centered?: boolean }[];

type CustomTableProps<ColumnsKeys> = {
  rows: RowsProps<ColumnsKeys>;
  columns: ColumnsProps<ColumnsKeys>;
};

export function CustomTable<ColumnKeysProps>({
  rows,
  columns,
}: CustomTableProps<ColumnKeysProps>) {
  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map(({ label, centered }, index) => {
          return (
            <TableCell
              key={index + Math.random()}
              variant="head"
              align={centered ? 'center' : 'left'}
              className="text-black font-bold"
              // align={column.numeric || false ? 'right' : 'left'}
              style={{ width: '100%' }}
              // sx={{
              //   backgroundColor: 'background.paper',
              // }}
            >
              {label}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  function rowContent(_index: number, row: any /*Data*/) {
    return (
      <React.Fragment>
        {columns.map(({ id, centered }, index) => (
          <TableCell
            key={index + Math.random()}
            align={centered ? 'center' : 'left'}
            // align={column.numeric || false ? 'right' : 'left'}
          >
            {row[id]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

  return (
    <Paper style={{ height: '400px', width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
