import { CustomSeparator } from './custom/custom-separator';
import {
  AddEditTeamModal,
  AddEditTeamModalSetTeamDataProps,
} from './modal/add-edit-team-modal';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { AllTeams } from './tabs/teams-tab/all-teams';
import { YourTeam } from './tabs/teams-tab/your-team';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useGetTeams } from '@/data/teams/use-get-teams';

export const TeamsTab = () => {
  const { getActiveCompetition } = useGetCompetitions();
  const { addTeam } = useSetTeams();
  const { getTeam } = useGetTeams();

  const handleCreateTeam = (data: AddEditTeamModalSetTeamDataProps) => {
    if (data) addTeam(data);
  };

  return (
    <>
      {!getActiveCompetition() ? (
        <div className="flex flex-col gap-2 justify-center items-center my-10">
          Select a competition first.
        </div>
      ) : !getTeam() ? (
        <div className="flex flex-col gap-4 justify-center items-center my-10">
          <div>
            You haven't created your team yet for the "
            <strong>{getActiveCompetition()?.name}</strong>" competition.
          </div>
          <AddEditTeamModal onSetTeam={handleCreateTeam} />
        </div>
      ) : (
        <div className="flex flex-col gap-4 justify-center items-center">
          <YourTeam />
          <CustomSeparator withText={false} className="my-12" />
          <AllTeams />
        </div>
      )}
    </>
  );
};
