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
import { FootballField } from '@/components/football-field';
import { FormationsDropdown } from '@/components/formations-dropdown';
import {
  AllPosibleFormationsProps,
  FormationPosition,
} from '@/utils/formations';
import { CustomButton } from '@/components/custom/custom-button';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';

type YourTeamKeyProps = 'PLAYER' | 'POSITION' | 'RATING';
type YourTeamProps = { team: CompetitionsCollectionTeamsProps };

export const YourTeam = ({ team }: YourTeamProps) => {
  const { getActiveCompetition } = useGetCompetitions();
  const { getPlayersSportmonksData } = useGetTeams();
  const { editTeam } = useSetTeams();

  const [formation, setFormation] = useState<AllPosibleFormationsProps>();
  const [playerPositonMap, setPlayerPositionMap] = useState<
    CompetitionsCollectionTeamsProps['players']
  >(team.players);

  const [fieldPosition, setFieldPosition] = useState<FormationPosition | ''>();
  const [tablePosition, setTablePosition] =
    useState<RowsProps<SelectableTableColumnKeysProps<YourTeamKeyProps>>[0]>();

  const [resetField, setResetField] = useState(0);
  const [resetTable, setResetTable] = useState(0);
  const [disabled, setDisabled] = useState(false);

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

        const rows: RowsProps<YourTeamKeyProps> = playersData.map((player) => {
          const id = player.id;
          const isInitiallySelected = !!team.players.find(
            (player) => player?.sportmonksId === id,
          )?.position;

          return {
            ID: id,
            PLAYER: (
              <div className="flex gap-1">
                <Avatar
                  src={player.image_path}
                  alt={player.display_name}
                  sx={{ width: 24, height: 24 }}
                />
                <span
                  className={`line-clamp-1 ${
                    isInitiallySelected ? 'font-bold' : ''
                  }`}
                >
                  {player.display_name}
                </span>
              </div>
            ),
            POSITION: player.position?.name,
            RATING: getPlayerRating(player.statistics),
          };
        });
        setRows(rows);
      }
    })();
  }, [team]);

  useEffect(() => {
    (async () => {
      const playerId = tablePosition?.ID;
      if (playerId && fieldPosition) {
        const filteredPlayerPositionMap: CompetitionsCollectionTeamsProps['players'] =
          playerPositonMap
            .map((player) => {
              if (player.position === fieldPosition) {
                return { sportmonksId: player.sportmonksId };
              } else return player;
            })
            .map((player) => {
              if (player.sportmonksId === playerId) {
                return {
                  sportmonksId: player.sportmonksId,
                  position: fieldPosition,
                };
              } else return player;
            });

        setPlayerPositionMap(filteredPlayerPositionMap);

        await new Promise((resolve) => setTimeout(resolve, 250)); // Add a delay so the use gets a feedback that the field-table match happened

        setFieldPosition('');
        setResetField(Math.random());
        setResetTable(Math.random());
      }
    })();
  }, [tablePosition, fieldPosition]);

  useEffect(() => {
    const diffFormation = team.formation !== formation;

    const areArraysIdentical = (arr1: any, arr2: any) =>
      isEqual(sortBy(arr1, 'sportmonksId'), sortBy(arr2, 'sportmonksId'));
    const diffPlayers = !areArraysIdentical(team.players, playerPositonMap);

    const shouldDisabled = !(diffFormation || diffPlayers);
    setDisabled(shouldDisabled);
  }, [formation, playerPositonMap]);

  useEffect(() => {
    if (formation && team.formation) {
      if (formation !== team.formation) {
        const playersResettedPosition = team.players.map((player) => ({
          sportmonksId: player.sportmonksId,
        }));
        setPlayerPositionMap(playersResettedPosition);
      }
    }
  }, [formation]);

  const handleSelectedRows = async (
    selectedRows: RowsProps<SelectableTableColumnKeysProps<YourTeamKeyProps>>,
  ) => {
    setTablePosition(selectedRows?.[0]);
  };

  const handlePlayerSelected = async (position: FormationPosition) => {
    setFieldPosition(position);
  };

  const handleEditTeam = async () => {
    const competitionId = getActiveCompetition()?.id;
    const shortId = team?.shortId;

    if (competitionId && shortId) {
      await editTeam(competitionId, shortId, {
        ...(formation ? { formation } : {}),
        ...(playerPositonMap?.length ? { players: playerPositonMap } : {}),
      });

      setDisabled(true);
    }
  };

  return (
    <div className="self-start w-full">
      <div className="flex flex-col gap-12">
        {/* YOUR TEAM */}
        <div className="w-full">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">Your Team</h1>
          <TeamCard team={team} />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 w-full justify-between">
          {/* FOOTBALL FIELD */}
          <div className="lg:w-[50%] flex flex-col gap-4">
            <div className="flex gap-4 justify-between">
              <div className="text-xl font-bold pb-2">Starting 11</div>
              <FormationsDropdown
                formation={team?.formation}
                getSelectedFormation={setFormation}
              />
            </div>
            <FootballField
              formation={formation}
              fieldPlayers={playerPositonMap}
              getSelectedPlayerPosition={handlePlayerSelected}
              emptyFormationMessage="Select a formation."
              resetField={resetField}
            />
          </div>

          {/* TEAM PLAYERS */}
          <div className="lg:w-[50%] flex flex-col justify-between">
            <div className="h-[350px] lg:h-[500px]">
              <div className="text-xl font-bold pb-2">Team Players</div>
              <div className="text-xs pb-4">
                * The <strong>bolded</strong> names are already saved.
              </div>
              <SelectableTable<YourTeamKeyProps>
                rows={rows}
                columns={columns}
                getSelectedRows={handleSelectedRows}
                singleSelection
                avoidReorder
                resetTable={resetTable}
              />
            </div>
            <div className="w-full flex justify-end">
              <CustomButton
                label="Edit team"
                widthFit
                className="px-14"
                disabled={disabled}
                handleClick={handleEditTeam}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
