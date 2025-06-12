import { ColumnsProps, RowsProps } from '@/components/custom/custom-table';
import { TeamCard } from './team-card';
import { useEffect, useState } from 'react';
import {
  getPlayerRating,
  getSportmonksPlayersDataByIds,
} from '@/sportmonks/common-methods';
import { Avatar } from '@mui/material';
import {
  CompetitionsCollectionTeamsProps,
  TEAMS_MAX_BENCH_PLAYERS,
} from '@/firebase/db-types';
import {
  SelectableTable,
  SelectableTableColumnKeysProps,
} from '@/components/table/selectable-table';
import { FootballField } from '@/components/football-field/football-field';
import { FormationsDropdown } from '@/components/tabs/teams-tab/formations-dropdown';
import {
  AllPosibleFormationsProps,
  FormationPosition,
} from '@/utils/formations';
import { CustomButton } from '@/components/custom/custom-button';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';
import { useAppSelector } from '@/store/hooks';

export type YourTeamKeyProps = 'PLAYER' | 'POSITION' | 'RATING';
type YourTeamProps = { team: CompetitionsCollectionTeamsProps };

export type TeamPlayersData =
  (CompetitionsCollectionTeamsProps['players'][0] & {
    apiData?: any;
  })[];

export const TEAM_GOALKEEPER_NAME = 'Goalkeeper';
export const TEAM_DEFENDER_NAME = 'Defender';
export const TEAM_MIDFIELDER_NAME = 'Midfielder';
export const TEAM_ATTACKER_NAME = 'Attacker';

export const YourTeam = ({ team }: YourTeamProps) => {
  const benchMode = useAppSelector((state) => state.team.benchMode);
  const { getActiveCompetition } = useGetCompetitions();
  const { editTeam } = useSetTeams();

  const [playersData, setPlayersData] = useState<TeamPlayersData>(team.players);
  const [formation, setFormation] = useState<AllPosibleFormationsProps>();

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
      const teamPlayers = team?.players;
      if (!teamPlayers?.length) return;

      const ids = teamPlayers.map((player) => player.sportmonksId);
      const apiData = await getSportmonksPlayersDataByIds(ids);

      const newTeamPlayers: TeamPlayersData = teamPlayers.map((player) => ({
        ...player,
        apiData: apiData.find((item) => item?.id === player.sportmonksId),
        bench: Array.from({ length: TEAMS_MAX_BENCH_PLAYERS }, (_, i) =>
          player.bench ? player.bench[i] : undefined,
        ),
      }));

      setPlayersData(newTeamPlayers);
    })();
  }, []);

  useEffect(() => {
    const allBenchPlayers = playersData
      .map((player) => player.bench)
      ?.flat(Infinity)
      .filter(Boolean);

    const rows: RowsProps<YourTeamKeyProps> = playersData
      .map((player) => {
        const id = player.sportmonksId;
        const isInitiallySelected = !!(
          playersData.find((player) => player?.sportmonksId === id)?.position ||
          allBenchPlayers.includes(id)
        );

        if (!player?.apiData) return {} as any; // To avoid to see empty data, we rather show the default empty message instead

        return {
          ID: id,
          PLAYER: (
            <div className="flex gap-1">
              <Avatar
                src={player?.apiData?.image_path}
                alt={player?.apiData?.display_name}
                sx={{ width: 24, height: 24 }}
              />
              <span
                className={`line-clamp-1 ${
                  isInitiallySelected ? 'font-bold' : ''
                }`}
              >
                {player?.apiData?.display_name}
              </span>
            </div>
          ),
          POSITION: player?.apiData?.position?.name,
          RATING: getPlayerRating(player?.apiData?.statistics),
          METADATA: { notAllowed: benchMode && isInitiallySelected },
        };
      })
      .filter(Boolean);

    setRows(rows);
  }, [playersData, benchMode]);

  useEffect(() => {
    (async () => {
      const playerId = tablePosition?.ID;
      if (playerId && fieldPosition) {
        const filteredPlayerPositionMap: CompetitionsCollectionTeamsProps['players'] =
          playersData
            .map((player) => {
              if (player.position === fieldPosition) {
                return {
                  ...player,
                  apiData: player.apiData,
                  sportmonksId: player.sportmonksId,
                };
              } else return player;
            })
            .map((player) => {
              if (player.sportmonksId === playerId) {
                return {
                  ...player,
                  sportmonksId: player.sportmonksId,
                  position: fieldPosition,
                };
              } else return player;
            });

        setPlayersData(filteredPlayerPositionMap);

        await new Promise((resolve) => setTimeout(resolve, 250)); // Add a delay so the use gets a feedback that the field-table match happened

        setFieldPosition('');
        setResetField(Math.random());
        setResetTable(Math.random());
      }
    })();
  }, [tablePosition, fieldPosition]);

  useEffect(() => {
    const competitionStarted = getActiveCompetition()?.competitionStarted;
    const competitionFinished = getActiveCompetition()?.competitionFinished;
    if (competitionStarted || competitionFinished) {
      setDisabled(true);
      return;
    }

    const diffFormation = team.formation !== formation;

    const areArraysIdentical = (arr1: any, arr2: any) =>
      isEqual(sortBy(arr1, 'sportmonksId'), sortBy(arr2, 'sportmonksId'));

    const noApiDataArray = playersData.map(({ apiData, ...rest }) => rest);
    const diffPlayers = !areArraysIdentical(team.players, noApiDataArray);

    const shouldDisabled = !(diffFormation || diffPlayers);
    setDisabled(shouldDisabled);
  }, [formation, playersData]);

  useEffect(() => {
    const savedFormation = team.formation;
    if (formation && savedFormation && formation !== savedFormation) {
      const playersResettedPosition = playersData.map(
        ({ position, ...rest }) => rest,
      );
      setPlayersData(playersResettedPosition);
    }
  }, [formation]);

  const handleSelectedRows = async (
    selectedRows: RowsProps<SelectableTableColumnKeysProps<YourTeamKeyProps>>,
  ) => {
    const selectedRow = selectedRows?.[0];
    setTablePosition(selectedRow);
  };

  const handlePlayerSelected = async (position: FormationPosition) => {
    setFieldPosition(position);
  };

  const handleEditTeam = async () => {
    const competitionId = getActiveCompetition()?.id;
    const shortId = team?.shortId;
    const noApiDataArray: CompetitionsCollectionTeamsProps['players'] =
      playersData.map(({ apiData, ...rest }) => rest);

    if (competitionId && shortId) {
      await editTeam(competitionId, shortId, {
        ...(formation ? { formation } : {}),
        ...(noApiDataArray?.length ? { players: noApiDataArray } : {}),
      });

      setDisabled(true);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* YOUR TEAM */}
      <TeamCard team={team} />

      <div className="flex flex-col lg:flex-row gap-12 w-full justify-between">
        {/* FOOTBALL FIELD */}
        <div className="lg:w-[40%] flex flex-col gap-4">
          <div className="flex gap-4 justify-between">
            <div className="text-xl font-bold pb-2">Starting 11</div>
            <FormationsDropdown
              formation={team?.formation}
              getSelectedFormation={setFormation}
            />
          </div>
          <FootballField
            formation={formation}
            fieldPlayers={playersData}
            setFieldPlayers={setPlayersData}
            selectedPlayer={tablePosition}
            setSelectedPlayer={setResetTable as any}
            getSelectedPlayerPosition={handlePlayerSelected}
            emptyFormationMessage="Select a formation."
            resetField={resetField}
          />
        </div>

        {/* TEAM PLAYERS */}
        <div className="lg:w-[60%] flex flex-col justify-between">
          <div className="h-[540px]">
            <div className="text-xl font-bold pb-2">Team Players</div>
            <div className="text-xs pb-4">
              * Click "<strong>Save</strong>" to confirm your changes.
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
              label="Save"
              widthFit
              className="px-14"
              disabled={disabled}
              handleClick={handleEditTeam}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
