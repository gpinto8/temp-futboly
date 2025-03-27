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
import { AllPosibleFormationsProps } from '@/utils/formations';
import { CustomButton } from '@/components/custom/custom-button';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';

type YourTeamKeyProps = 'PLAYER' | 'POSITION' | 'RATING';
type YourTeamProps = { team: CompetitionsCollectionTeamsProps };

export const YourTeam = ({ team }: YourTeamProps) => {
  const { getActiveCompetition } = useGetCompetitions();
  const { getPlayersSportmonksData } = useGetTeams();
  const { editTeam } = useSetTeams();

  const [formation, setFormation] = useState<AllPosibleFormationsProps>();
  const [fieldPlayers, setFieldPlayers] = useState<
    CompetitionsCollectionTeamsProps['players']
  >([]);

  const [fieldPosition, setFieldPosition] = useState('');
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

  useEffect(() => {
    (async () => {
      if (tablePosition && fieldPosition) {
        const id = tablePosition.ID;
        setFieldPlayers([
          ...fieldPlayers?.filter((player) => player.sportmonksId !== id),
          { sportmonksId: id, position: fieldPosition },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 250)); // Add a delay so the use gets a feedback that the field-table match happened

        setFieldPosition('');
        setResetField(Math.random());
        setResetTable(Math.random());
      }
    })();
  }, [tablePosition, fieldPosition]);

  useEffect(() => {
    const diffFormation = team.formation !== formation;
    const shouldDisabled = !(diffFormation || fieldPlayers?.length);
    setDisabled(shouldDisabled);
  }, [formation, fieldPlayers]);

  const handleSelectedRows = async (
    selectedRows: RowsProps<SelectableTableColumnKeysProps<YourTeamKeyProps>>,
  ) => {
    setTablePosition(selectedRows?.[0]);
  };

  const handlePlayerSelected = async (position: string) => {
    setFieldPosition(position);
  };

  const handleEditTeam = async () => {
    const competitionId = getActiveCompetition()?.id;
    const shortId = team?.shortId;

    if (competitionId && shortId && formation) {
      await editTeam(competitionId, shortId, { formation });

      setDisabled(true);
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
          <div className="md:w-1/3 flex flex-col gap-4">
            <div className="flex gap-4 justify-between">
              <div className="text-xl font-bold pb-2">Starting 11</div>
              <FormationsDropdown
                formation={team?.formation}
                getSelectedFormation={setFormation}
              />
            </div>
            <FootballField
              formation={formation}
              fieldPlayers={fieldPlayers}
              getSelectedPlayerPosition={handlePlayerSelected}
              emptyFormationMessage="Select a formation."
              resetField={resetField}
            />
          </div>

          {/* TEAM PLAYERS */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div className="h-[500px]">
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
            <div className="w-full flex justify-end">
              <CustomButton
                label="Edit team"
                widthFit
                className="px-10"
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
