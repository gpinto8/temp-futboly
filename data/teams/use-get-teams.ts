import { useAppSelector } from '@/store/hooks';

export const useGetTeams = () => {
  const team = useAppSelector((state) => state.team);

  // GET CURRENT TEAM FROM REDUX BASED ON CURRENT ACTIVE COMPETITION
  const getTeam = () => team?.currentTeam;

  return {
    getTeam,
  };
};
