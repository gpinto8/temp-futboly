import { CustomButton } from './custom-button';
import { CustomInput } from './custom-input';
import { CustomModal } from './custom-modal';
import { ColumnsProps, CustomTable, RowsProps } from './custom-table';

type AdminColumnKeysProps = 'INDEX' | 'TEAM' | 'OWNER' | 'PLAYERS' | 'ACTIONS';

const EditModal = (row: any) => {
  type PlayersColumnKeysProps = 'INDEX' | 'PLAYER' | 'POSITION' | 'RATING' | 'CLUB' | 'ACTIONS';

  const columns: ColumnsProps<PlayersColumnKeysProps> = [
    { label: '#', id: 'INDEX' },
    { label: 'Player', id: 'PLAYER' },
    { label: 'Position', id: 'POSITION' },
    { label: 'Rating', id: 'RATING', centered: true },
    { label: 'Club', id: 'CLUB', centered: true },
    { label: 'Actions', id: 'ACTIONS', centered: true },
  ];

  const rows: RowsProps<PlayersColumnKeysProps> = [
    { INDEX: 1, PLAYER: 'player1', POSITION: 'goalkeeper', RATING: 49, CLUB: 'club1' },
  ].map(row => ({
    ...row,
    ACTIONS: 'X',
  }));
  console.log({row})

  return (
    <CustomModal title={`${row?.TEAM}'s team`} buttonClass="!w-1/4 !h-1/4" buttonLabel="Edit">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <CustomInput label="Name" />
          <CustomInput label="Type" />
          <CustomTable<PlayersColumnKeysProps> rows={rows} columns={columns} />
        </div>
        <CustomButton label=" " />
      </div>
    </CustomModal>
  );
};

export const AdminTabTeams = () => {
  const rows: RowsProps<AdminColumnKeysProps> = [
    { INDEX: 1, TEAM: 'Team1', OWNER: 'gpinto8', PLAYERS: 49 },
  ].map(row => ({
    ...row,
    ACTIONS: (
      <div className="flex gap-1">
        <EditModal row={row} />
        <CustomButton label="Delete" style="error" className="!w-1/4 !h-1/4" />,
      </div>
    ),
  }));

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX' },
    { label: 'Team', id: 'TEAM' },
    { label: 'Owner', id: 'OWNER' },
    { label: 'Players', id: 'PLAYERS', centered: true },
    { label: 'Actions', id: 'ACTIONS', centered: true },
  ];

  return (
    <div>
      <CustomTable<AdminColumnKeysProps> rows={rows} columns={columns} />
    </div>
  );
};
