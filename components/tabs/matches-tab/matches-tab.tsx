import { useEffect, useState } from 'react';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { Matches } from '@/components/tabs/matches-tab/matches';
import { useAppSelector } from '@/store/hooks';

export const MatchesTab = () => {
  const competition = useAppSelector((state) => state.competition);
  const { getPersonalMatches, getAllMatches, getMatchStatistics } =
    useGetMatches();
  const [personalMatchHistory, setPersonalMatchHistory] = useState<any>(null);
  const [allMatchHistory, setAllMatchHistory] = useState<any>(null);
  const [personalStatistics, setPersonalStatistics] = useState<any>(null);

  useEffect(() => {
    setPersonalMatchHistory(getPersonalMatches());
    setAllMatchHistory(getAllMatches());
    setPersonalStatistics(getMatchStatistics());
  }, [competition]);

  return (
    <Matches
      personalMatchHistory={personalMatchHistory}
      allMatchHistory={allMatchHistory}
      matchStatistics={personalStatistics}
    />
  );
};
