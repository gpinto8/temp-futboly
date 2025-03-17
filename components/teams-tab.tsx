import { CustomSeparator } from './custom/custom-separator';
import {
  AddEditTeamModal,
  AddEditTeamModalDataProps,
} from './modal/add-edit-team-modal';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { AllTeams } from './tabs/teams-tab/all-teams';
import { YourTeam } from './tabs/teams-tab/your-team';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { getShortBase64Id } from '@/utils/id';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useGetUsers } from '@/data/users/use-get-users';

export const TeamsTab = () => {
  const { getCurrentUserRef, getUser } = useGetUsers();
  const { getCurrentActiveCompetitionRef, getActiveCompetition } =
    useGetCompetitions();
  const { getCurrentSelectedLeagueRef } = useGetLeagues();
  const { getTeam } = useGetTeams();
  const { addTeam } = useSetTeams();

  const userRef = getCurrentUserRef();
  const leagueRef = getCurrentSelectedLeagueRef();
  const competitionRef = getCurrentActiveCompetitionRef();

  const handleCreateTeam = (data: AddEditTeamModalDataProps) => {
    const shortId = getShortBase64Id();
    const name = data.name;
    const coach = data.coach;
    const logoId = data.logoId;

    if (
      shortId &&
      userRef &&
      leagueRef &&
      competitionRef &&
      name &&
      coach &&
      logoId
    ) {
      const data: CompetitionsCollectionTeamsProps = {
        shortId,
        userRef,
        leagueRef,
        competitionRef,
        name,
        coach,
        logoId,
      };

      if (data) addTeam?.(data);
    }
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
          <AddEditTeamModal
            data={{ owner: getUser()?.username }}
            onSetData={handleCreateTeam}
          />
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
