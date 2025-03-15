import { useAppSelector } from '@/store/hooks';
import { useGetCompetitions } from '../competitions/use-get-competitions';

export const useGetTeams = () => {
  const team = useAppSelector((state) => state.team);
  const { getActiveCompetition } = useGetCompetitions();

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

  return {
    getTeam,
    getTeamByUid,
  };
};
