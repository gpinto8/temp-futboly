import { LeagueCollectionCompetitionProps } from '@/firebase/db-types';
import { useAppSelector } from '@/store/hooks';
import { Timestamp } from 'firebase/firestore';

export const useGetCompetitions = () => {
  const league = useAppSelector((state) => state.league);

  const mapCompetition = (
    competition: LeagueCollectionCompetitionProps,
    index: number,
  ) => {
    const toDate = (date: Timestamp) =>
      date && new Date(date.toDate()).toLocaleDateString();

    return {
      indexNo: ++index,
      startDateText: toDate(competition?.startDate),
      endDateText: toDate(competition?.endDate),
      active: competition?.active,
      id: competition?.id,
      name: competition?.name,
      players: competition?.players,
      usersTotal: 'TODO',
      teamsTotal: 'TODO',
      type: 'TODO' as any,
      activeText: competition?.active ? 'Active' : 'Non-Active',
      status: '',
      currentWeek: 'TODO',
    };
  };

  // GET CURRENT COMPETITION FROM CURRENT LEAGUE
  const getCompetition = () => league?.competitions?.map(mapCompetition);

  // GET CURRENT ACTIVE COMPETITION FROM CURRENT LEAGUE
  const getActiveCompetition = () => {
    return getCompetition()?.find(({ active }) => active);
  };

  return { getCompetition, getActiveCompetition };
};
