import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';

type AdminColumnKeysProps = 'INDEX' | 'USER' | 'TEAM' | 'ACTIONS';

export const AdminTabUsers = () => {
  const rows: RowsProps<AdminColumnKeysProps> = [{ INDEX: 1, TEAM: "Team1", USER: "gpinto8" }].map(row => ({
    ...row,
    ACTIONS: <CustomButton label="Kick" style="error" className='!w-1/4 !h-1/4' />,
  }));
  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX' },
    { label: 'User', id: 'USER' },
    { label: 'Team', id: 'TEAM' },
    { label: 'Actions', id: 'ACTIONS', centered: true },
  ];

  return (
    <div>
      <CustomTable<AdminColumnKeysProps> rows={rows} columns={columns} />
    </div>
  );
};
