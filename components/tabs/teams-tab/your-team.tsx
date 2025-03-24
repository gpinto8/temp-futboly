import { ColumnsProps, RowsProps } from '@/components/custom/custom-table';
import { TeamCard } from './team-card';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { useEffect, useState } from 'react';
import { getPlayerRating } from '@/sportmonks/common-methods';
import { Avatar } from '@mui/material';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import {
  SelectableTable,
  SelectableTableColumnKeysProps,
} from '@/components/table/selectable-table';

type YourTeamKeyProps = 'PLAYER' | 'POSITION' | 'RATING';
type YourTeamProps = { team: CompetitionsCollectionTeamsProps };

export const YourTeam = ({ team }: YourTeamProps) => {
  const { getPlayersSportmonksData } = useGetTeams();

  const [selectedPosition, setSelectedPosition] = useState(0);
  const [fieldPlayersMap, setFieldPlayersMap] = useState<any>([]);
  const [selectedRow, setSelectedRow] =
    useState<RowsProps<SelectableTableColumnKeysProps<YourTeamKeyProps>>[0]>();
  const [resetTable, setResetTable] = useState(0);

  const [rows, setRows] = useState<RowsProps<YourTeamKeyProps>>([]);
  const columns: ColumnsProps<YourTeamKeyProps> = [
    { label: 'Player', id: 'PLAYER', minWidth: 150 },
    { label: 'Position', id: 'POSITION', minWidth: 100, align: 'center' },
    { label: 'Rating', id: 'RATING', minWidth: 50, align: 'center' },
  ];

  useEffect(() => {
    (async () => {
      const players = team?.players;
      if (players) {
        const playerIds = team.players.map((player) => player.sportmonksId);
        const playersData = await getPlayersSportmonksData(playerIds);

        const rows: RowsProps<YourTeamKeyProps> = playersData.map((player) => ({
          ID: player.id,
          PLAYER: (
            <div className="flex gap-1">
              <Avatar
                src={player.image_path}
                alt={player.display_name}
                sx={{ width: 24, height: 24 }}
              />
              <span className="line-clamp-1">{player.display_name}</span>
            </div>
          ),
          POSITION: player.position?.name,
          RATING: getPlayerRating(player.statistics),
        }));
        setRows(rows);
      }
    })();
  }, [team]);

  const updateFieldPlayers = async (
    selectedRow?: RowsProps<
      SelectableTableColumnKeysProps<YourTeamKeyProps>
    >[0],
    position?: number,
  ) => {
    if (selectedRow && position) {
      setFieldPlayersMap([
        ...fieldPlayersMap,
        { id: selectedRow.ID, position },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 250));
      setSelectedPosition(0);
      setResetTable(Math.random());
    }
  };

  const handleSelectedRows = async (
    selectedRows: RowsProps<SelectableTableColumnKeysProps<YourTeamKeyProps>>,
  ) => {
    const selectedRow = selectedRows?.[0];
    setSelectedRow(selectedRow);
    await updateFieldPlayers(selectedRow, selectedPosition);
  };

  const handleClick = async (position: number) => {
    if (position === selectedPosition) {
      setSelectedPosition(0); // Reset the position if selected the already selected one
    } else {
      setSelectedPosition(position);
      await updateFieldPlayers(selectedRow, position);
    }
  };

  return (
    <div className="self-start w-full">
      <div className="flex flex-col gap-12">
        {/* YOUR TEAM */}
        <div className="w-full">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">Your Team</h1>
          <TeamCard team={team} />
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* FOOTBALL FIELD */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="text-xl font-bold pb-2">Starting 11</div>
            <div>FOOTBALL FIELD</div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => (
              <div
                className={`cursor-pointer text-white h-10 ${
                  selectedPosition === position
                    ? '!bg-errorDark'
                    : '!bg-gray-400'
                }`}
                onClick={() => handleClick(position)}
              >
                POSITION {position} {selectedPosition}
              </div>
            ))}
          </div>
          {/* TEAM PLAYERS */}
          <div className="md:w-1/2 h-[750px]">
            <div className="text-xl font-bold pb-2">Team Players</div>
            <SelectableTable<YourTeamKeyProps>
              rows={rows}
              columns={columns}
              getSelectedRows={handleSelectedRows}
              singleSelection
              avoidReorder
              resetTable={resetTable}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
