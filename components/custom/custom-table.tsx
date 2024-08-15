import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents, Virtuoso } from 'react-virtuoso';
import { CustomButton } from './custom-button';
import CustomScrollbar from '../Scrollbar';

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

// const virtuosoTableComponents = (tableRef: any, intersectedCallback: () => void) => {
//   // React.useEffect(() => {
//   //   if (showLastChild) {
//   //     const observer = new IntersectionObserver(entries => {
//   //       const target = entries[0];
//   //       // console.log({ target });
//   //       if (target.isIntersecting) {
//   //         console.log('intersected');
//   //         intersectedCallback?.();
//   //       }
//   //     });

//   //     if (loaderRef.current) {
//   //       observer.observe(loaderRef.current);
//   //     }

//   //     return () => {
//   //       if (loaderRef.current) {
//   //         observer.unobserve(loaderRef.current);
//   //       }
//   //     };
//   //   }
//   // }, []);

//   // const showMoreRef = React.useRef(null);

//   // const handleShowMore = async (event: any) => {
//   //   console.log({ event });
//   //   event.preventDefault();
//   //   const length = await intersectedCallback?.();
//   //   // console.log({ tableRef, length });
//   //   // console.log(event.target.scrollTop);
//   //   if (tableRef.current) {
//   //     //   console.log({ tableRef: tableRef.current });
//   //     // tableRef.current?.scrollToIndexd(length);
//   //   } //

//   //   // scrollTo(-1, -1);
//   // };

//   return {
//     Scroller: React.forwardRef<HTMLDivElement>((props, ref) => {
//       // console.log({ props, ref });
//       return <TableContainer component={Paper} {...props} ref={ref} />;
//     }),
//     Table: (props: any) => (
//       <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
//     ),
//     TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
//       <TableHead {...props} ref={ref} />
//     )),
//     TableRow,
//     TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => {
//       // console.log({ ref });
//       return (
//         <TableBody
//           style={{ overflowAnchor: 'none' }}
//           {...props}
//           ref={ref}
//           onScroll={(event: any) => console.log({ event2: event })}
//         />
//       );
//     }),
//     TableFoot: React.forwardRef<HTMLTableSectionElement>((props, ref) => {
//       // console.log({ ref });

//       return (
//         <div
//           style={{
//             padding: '2rem',
//             display: 'flex',
//             justifyContent: 'center',
//           }}
//           {...props}
//           ref={ref}
//         >
//           Loading...
//         </div>
//       );
//     }),
//   };
// };

// type COLUMN_KEYS = 'INDEX' | 'USER' | 'TEAM' | 'ACTIONS';
// interface ColumnData {
//   id: COLUMN_KEYS;
//   label: string;
// }

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
  customRows?: {
    className?: string;
    hideHorizontalLine?: boolean;
  };
  customColumns?: {
    className?: string;
  };
  intersectedCallback?: any;
  showLastChild?: boolean;
  elevation?: number;
};

export function CustomTable<ColumnKeysProps>({
  rows,
  columns,
  className,
  height,
  customRows = {},
  customColumns = {},
  intersectedCallback,
  showLastChild,
  elevation,
}: CustomTableProps<ColumnKeysProps>) {
  const tableRef = React.useRef(null);

  function fixedHeaderContent() {
    return (
      <div className="flex w-full gap-2 pb-2">
        {columns.map(({ label, centered, width }, index) => {
          //index === columns.length - 1;
          const widthPercentage = width && 'w-fit';
          return (
            <div
              key={index + Math.random()}
              // variant="head"
              // align={centered ? 'center' : 'left'}
              className={`w-full  text-black font-bold ${customColumns?.className || ''} ${
                centered ? 'flex justify-center items-center' : ''
              }`}
              style={{ ...(width ? { minWidth: width + 'px', width: 'fit-content' } : {}) }}
              // align={column.numeric || false ? 'right' : 'left'}
              // style={{ width: '100px' }}
              // sx={{
              //   backgroundColor: 'background.paper',
              // }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  function rowContent(_index: number, row: any /*Data*/) {
    // console.log({ _index, row });
    return (
      <div className="flex w-full gap-2">
        {columns.map(({ id, centered, width }, index) => {
          // console.log({ width });
          // const widthPercentage = width && 'w-fit';
          //width && `w-[${+width}%]`.toString();
          return (
            <div
              key={index + Math.random()}
              // ${widthPercentage || 'w-full'}
              // align={centered ? 'center' : 'left'}
              className={`w-full line-clamp-1 pb-1
               ${customRows?.hideHorizontalLine ? 'border-none' : ''} ${customRows?.className || ''}
              ${centered ? 'flex justify-center items-center' : ''} `}
              // align={column.numeric || false ? 'right' : 'left'}
              style={{ ...(width ? { minWidth: width + 'px', width: 'fit-content' } : {}) }}
            >
              {row[id]}
            </div>
          );
        })}
      </div>
    );
  }

  // const getComponents = () => {
  //   // fai quello li await virutsosotablecomponents
  //   // if (tableRef.current) tableRef.current?.scrollToIndex(50);
  //   return virtuosoTableComponents(tableRef, intersectedCallback);
  // };

  // const [users, setUsers] = React.useState(() => []);

  // function generateUsers(count: any, start: any) {
  //   return Array.from({ length: count }, (_, i) => ({
  //     id: `User ${start + i + 1}`,
  //   }));
  // }

  const Footer2 = () => {
    return (
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    );
  };

  // const loadMore = React.useCallback(() => {
  //   return setTimeout(() => {
  //     setUsers([{ id: 1 }, { id: 2 }]);
  //   }, 500);
  // }, [setUsers]);

  // React.useEffect(() => {
  //   const timeout = loadMore();
  //   return () => clearTimeout(timeout);
  // }, []);

  // const [users, setUsers] = React.useState(() => []);

  // function generateUsers(count: any, start: any) {
  //   return Array.from({ length: count }, (_, i) => ({
  //     name: `User ${start + i}`,
  //   }));
  // }

  const loadMore = React.useCallback(() => {
    console.log('load more');
    if (intersectedCallback) {
      // return setTimeout(() => {
      intersectedCallback?.();
      // setUsers((users: any) => [...users, ...generateUsers(100, users.length)] as any);
      // }, 500);
    }
  }, [intersectedCallback]);

  // React.useEffect(() => {
  //   const timeout = loadMore();
  //   return () => clearTimeout(timeout);
  // }, []);

  // return (
  //   <Virtuoso
  //     style={{ height: 300 }}
  //     data={users}
  //     endReached={loadMore}
  //     increaseViewportBy={200}
  //     itemContent={(index, user) => {
  //       return <div>{(user as any).name}</div>;
  //     }}
  //     components={{ Footer }}
  //   />
  // );

  const newHeight = `${height || 400}px`;
  const newElevation = elevation ?? 1;

  return (
    <Paper style={{ height: newHeight, width: '100%' }} elevation={newElevation}>
      <Virtuoso
        // endReached={() => console.log('end reached')}
        ref={tableRef}
        data={rows}
        className={className}
        // components={getComponents()}
        // fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        style={{ height: newHeight }}
        // data={users}
        endReached={loadMore}
        // increaseViewportBy={200}
        // itemContent={(index, user: any) => {
        //   return <div>{user.name}</div>;
        // }}
        components={{
          Footer: Footer2 as any,
          Header: fixedHeaderContent,
          // Scroller: (props, ref) => <CustomScrollbar props={props} ref={ref} children={null} />,
        }}
      />
    </Paper>
  );
}
