import { useGetUsers } from '@/data/users/use-get-users';
import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { MappedLeaguesProps } from '@/firebase/db-types';

type AdminColumnKeysProps = 'INDEX' | 'USER' | 'ROLE' | 'TEAM' | 'ACTIONS';

export const AdminTabUsers = () => {
  const league: MappedLeaguesProps = useAppSelector((state) => state.league);
  const { removeUserFromLeague } = useGetUsers();
  const [rows, setRows] = useState<RowsProps<AdminColumnKeysProps>>([]);

  useEffect(() => {
    const setUsersRows = async () => {
      const users = league.players;
      const userRows = users.map((user, index) => ({
        INDEX: index + 1,
        USER: user.username,
        TEAM: 'TODO',
        ROLE: user.role,
        ACTIONS: (
          <CustomButton
            label="Kick"
            style="error"
            className="!w-1/4 !h-1/4"
            handleClick={() => removeUserFromLeague(user?.uid)}
            disabled={user.role === 'owner'}
          />
        ),
      }));
      setRows(userRows);
    };

    if (
      league &&
      league.id &&
      String(league.id).trim() !== '' &&
      league.players
    ) {
      setUsersRows();
    }
  }, [league]);

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'User', id: 'USER', minWidth: 100 },
    { label: 'Role', id: 'ROLE', minWidth: 100, align: 'center' },
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
