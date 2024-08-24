import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';

type AdminColumnKeysProps = 'INDEX' | 'COMPETITION' | 'TYPE' | 'TEAMS' | 'STATUS' | 'ACTIONS';

export const AdminTabCompetitions = () => {
  const rows: RowsProps<AdminColumnKeysProps> = [
    { INDEX: 1, COMPETITION: 'Competition', TYPE: 'Classic', TEAMS: '12', STATUS: 'On going' },
  ].map(row => ({
    ...row,
    ACTIONS: <CustomButton label="Delete" style="error" className="!w-1/4 !h-1/4" />,
  }));

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Competition', id: 'COMPETITION', minWidth: 100 },
    { label: 'Type', id: 'TYPE', align: 'center', minWidth: 100 },
    { label: 'Teams', id: 'TEAMS', align: 'center', minWidth: 50 },
    { label: 'Status', id: 'STATUS', align: 'center', minWidth: 100 },
    { label: 'Actions', id: 'ACTIONS', align: 'center', minWidth: 100 },
  ];

  return (
    <div className="h-[400px]">
      <CustomTable<AdminColumnKeysProps>
        rows={rows}
        columns={columns}
        maxWidth={1000}
        elevation={0}
      />
    </div>
  );
};
