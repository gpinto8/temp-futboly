import { useEffect, useState } from 'react';
import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import {
  AddEditTeamModal,
  AddEditTeamModalDataProps,
} from '../modal/add-edit-team-modal';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useAppSelector } from '@/store/hooks';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';

type AdminColumnKeysProps =
  | 'INDEX'
  | 'COMPETITION'
  | 'TEAM'
  | 'OWNER'
  | 'PLAYERS'
  | 'ACTIONS';

export const AdminTabTeams = () => {
  const teams = useAppSelector((state) => state.team);
  const { getAllTeamsFromAllCompetitions } = useGetTeams();
  const { deleteTeam, editTeam } = useSetTeams();
  const [rows, setRows] = useState<RowsProps<AdminColumnKeysProps>>([]);

  const getAllTeamsAndUpdateRows = async () => {
    const allTeams = await getAllTeamsFromAllCompetitions();

    const _rows: RowsProps<AdminColumnKeysProps> = allTeams.map((team, i) => {
      const {
        competitionName,
        shortId,
        logoId,
        name,
        ownerUsername,
        coach,
        competitionRef,
        players,
      } = team;

      const selectedPlayerIds = players?.map((player) => player.sportmonksId);
      const data = {
        logoId,
        name,
        owner: ownerUsername,
        coach,
        selectedPlayerIds,
      };

      const handleEditTeam = (team: AddEditTeamModalDataProps) => {
        const newTeam: Partial<CompetitionsCollectionTeamsProps> = {
          coach: team?.coach,
          logoId: team?.logoId,
          name: team?.name,
          players: team?.selectedPlayerIds?.map((sportmonksId) => ({
            sportmonksId,
          })),
        };

        editTeam(competitionRef.id, shortId, newTeam);
      };

      return {
        INDEX: i + 1,
        COMPETITION: competitionName,
        TEAM: name,
        OWNER: ownerUsername,
        PLAYERS: '',
        ACTIONS: (
          <div className="flex gap-1">
            <AddEditTeamModal data={data} isEdit onSetData={handleEditTeam} />
            <CustomButton
              label="Delete"
              style="error"
              className="!w-1/4 !h-1/4"
              handleClick={() => deleteTeam(competitionRef.id, shortId)}
            />
          </div>
        ),
      };
    });

    setRows(_rows);
  };

  useEffect(() => {
    (async () => await getAllTeamsAndUpdateRows())();
  }, [teams.refreshAdminTeams]);

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Competition', id: 'COMPETITION', minWidth: 100 },
    { label: 'Team', id: 'TEAM', minWidth: 100 },
    { label: 'Owner', id: 'OWNER', minWidth: 100 },
    { label: 'Players', id: 'PLAYERS', align: 'center', minWidth: 50 },
    { label: 'Actions', id: 'ACTIONS', align: 'center', minWidth: 200 },
  ];

  return (
    <div className="h-[400px] ">
      <CustomTable<AdminColumnKeysProps>
        rows={rows}
        columns={columns}
        maxWidth={1000}
        elevation={0}
      />
    </div>
  );
};
