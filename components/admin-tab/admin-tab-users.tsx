import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';

type AdminColumnKeysProps = 'INDEX' | 'USER' | 'TEAM' | 'ACTIONS';

export const AdminTabUsers = () => {
  const rows: RowsProps<AdminColumnKeysProps> = [{ INDEX: 1, TEAM: 'Team1', USER: 'gpinto8' }].map(
    row => ({
      ...row,
      ACTIONS: <CustomButton label="Kick" style="error" className="!w-1/4 !h-1/4" />,
    })
  );

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'User', id: 'USER', minWidth: 100 },
    { label: 'Team', id: 'TEAM', minWidth: 100 },
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
