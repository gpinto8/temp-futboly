import {
  AddEditTeamModal,
  AddEditTeamModalDataProps,
} from '../../modal/add-edit-team-modal';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { AllTeams } from './all-teams';
import { YourTeam } from './your-team';
import { useSetTeams } from '@/data/teams/use-set-teams';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { getShortBase64Id } from '@/utils/id';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useGetUsers } from '@/data/users/use-get-users';
import { EmptyMessage } from '../../empty-message';
import { TabSectionSpacer } from '../tab-section-spacer';

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
  const team = getTeam();

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
        players: [], // The players will be added by the admin (editing it), not by the user
      };

      if (data) addTeam?.(data);
    }
  };

  return (
    <>
      {getActiveCompetition()?.competitionStarted && (
        <EmptyMessage
          title="Your competition has started! 🎊"
          description="It meanst that you no longer can modify your formation or player's position. Wait till the competition finishes!"
          noSpaces
          className="bg-main-100 text-white p-10 rounded-2xl"
        />
      )}
      <TabSectionSpacer
        firstSection={{
          title: 'Your Team',
          Component: () => (team ? <YourTeam team={team} /> : <div />),
        }}
        secondSection={{
          title: 'All Teams',
          Component: () => <AllTeams />,
        }}
        emptyMessage={{
          condition: !getActiveCompetition() || !team,
          Component: () => {
            return !getActiveCompetition() ? (
              <EmptyMessage
                title="Select a competition to create a team! 💪"
                description='You gotta first select any competition from the "Competitions" tab to create a team on it.'
              />
            ) : !team ? (
              <EmptyMessage
                title="Create your team! 😎"
                description={
                  <div className="flex flex-col gap-4 items-center">
                    <div>
                      Start your journey by creating your team for the{' '}
                      <strong>"{getActiveCompetition()?.name}"</strong>{' '}
                      competition.
                    </div>
                    <AddEditTeamModal
                      data={{ owner: getUser()?.username }}
                      onSetData={handleCreateTeam}
                    />
                  </div>
                }
              />
            ) : (
              <div />
            );
          },
        }}
      />
    </>
  );
};
