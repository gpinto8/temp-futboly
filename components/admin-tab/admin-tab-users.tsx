import { useGetUsers } from '@/data/users/use-get-users';
import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

type AdminColumnKeysProps = 'INDEX' | 'USER' | 'TEAM' | 'ACTIONS';

export const AdminTabUsers = () => {
  const league = useAppSelector((state) => state.league);
  const { removeUserFromLeague, getLeagueUsers } = useGetUsers();
  const [rows, setRows] = useState<RowsProps<AdminColumnKeysProps>>([]);

  useEffect(() => {
    (async () => {
      const users = await getLeagueUsers();
      const userRows = users.map((user) => ({
        INDEX: user?.indexNo,
        USER: user?.ownerUsername,
        TEAM: user?.team,
        ACTIONS: (
          <CustomButton
            label="Kick"
            style="error"
            className="!w-1/4 !h-1/4"
            handleClick={() => removeUserFromLeague(user?.ownerId)}
          />
        ),
      }));
      setRows(userRows);
    })();
  }, [league]);

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
