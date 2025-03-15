import { useAppSelector } from '@/store/hooks';
import { useGetCompetitions } from '../competitions/use-get-competitions';
import { useGetUsers } from '../users/use-get-users';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';

export const useGetTeams = () => {
  const team = useAppSelector((state) => state.team);
  const { getActiveCompetition, getCompetitionById } = useGetCompetitions();
  const { getUserFromUui } = useGetUsers();

  // GET CURRENT TEAM FROM REDUX BASED ON CURRENT ACTIVE COMPETITION
  const getTeam = () => team?.currentTeam;

  // GET TEAM BY USER ID BASED ON CURRENT ACTIVE COMPETITION
  const getTeamByUid = (uid: string) => {
    const currentCompetition = getActiveCompetition();
    const competitionTeams = currentCompetition?.teams;

    if (competitionTeams) {
      const currentUserTeam = competitionTeams?.find(
        (team) => team.userRef.id === uid,
      );
      if (currentUserTeam) return currentUserTeam;
    }
  };

  // GET ALL TEAMS FROM CURRENT COMPETITION
  const getAllTeams = async (incluceExtraProps?: boolean) => {
    const currentCompetition = getActiveCompetition();
    const competitionTeams = currentCompetition?.teams;

    let allTeams: (CompetitionsCollectionTeamsProps & {
      ownerUsername?: string;
      competitionName?: string;
    })[] = [];

    if (competitionTeams) {
      if (incluceExtraProps) {
        const teams: any = [];

        for await (const team of competitionTeams) {
          const userId = team.userRef.id;
          const userData = await getUserFromUui(userId);
          const ownerUsername = userData?.username;

          const competitionId = team.competitionRef.id;
          const competitionData = await getCompetitionById(competitionId);
          const competitionName = competitionData?.name;

          teams.push({ ...team, ownerUsername, competitionName });
        }

        allTeams = teams;
      } else allTeams = competitionTeams;
    }

    if (allTeams?.length) return allTeams;
  };

  return {
    getTeam,
    getTeamByUid,
    getAllTeams,
  };
};
