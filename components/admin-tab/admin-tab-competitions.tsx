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
    { label: '#', id: 'INDEX' },
    { label: 'Competition', id: 'COMPETITION' },
    { label: 'Type', id: 'TYPE' },
    { label: 'No. Teams', id: 'TEAMS', centered: true },
    { label: 'Status', id: 'STATUS' },
    { label: 'Actions', id: 'ACTIONS', centered: true },
  ];

  return (
    <div className="h-[400px]">
      <CustomTable<AdminColumnKeysProps> rows={rows} columns={columns} />
    </div>
  );
};
