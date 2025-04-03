import { useState, useEffect } from 'react';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomSeparator } from '@/components/custom/custom-separator';
import { UpcomingMatch } from '@/components/tabs/live-match-tab/upcoming-match';
import { LiveMatchSection } from '@/components/tabs/live-match-tab/live-match-section';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { PageLoader } from '@/components/page-loader';

export const LiveMatch = () => {
  const {
    getUpcomingMatches,
    getTimeToNextMatch,
    getNextMatch,
    getNextMatchRatings,
  } = useGetMatches();
  const { getPlayersSportmonksData } = useGetTeams();
  const upcomingMatches = getUpcomingMatches(5);

  const [timeLeftToNextMatch, setTimeLeftToNextMatch] =
    useState<number>(getTimeToNextMatch());
  const [nextMatchFound, setNextMatchFound] = useState<Boolean>(false);

  const [nextMatchMapped, setNextMatchMapped] = useState<any>(null);
  const [nextMatchWithRating, setNextMatchWithRating] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const nextMatch = getNextMatch();
      if (!nextMatch || nextMatch === -1) return;
      setNextMatchFound(true);
      const homePlayerIds = nextMatch.home.players.map(
        (player: any) => player.sportmonksId,
      );
      const awayPlayerIds = nextMatch.away.players.map(
        (player: any) => player.sportmonksId,
      );
      const homeReturnAPIData = await getPlayersSportmonksData(homePlayerIds);
      const awayReturnAPIData = await getPlayersSportmonksData(awayPlayerIds);
      if (!homeReturnAPIData && !awayReturnAPIData) return;
      const tempNextMatch = {
        ...nextMatch,
        home: {
          ...nextMatch.home,
          players: homeReturnAPIData,
        },
        away: {
          ...nextMatch.away,
          players: awayReturnAPIData,
        },
      };
      setNextMatchMapped(tempNextMatch);
      if (timeLeftToNextMatch < 1) {
        //Match started
        const nextMatchWithRatingRes = await getNextMatchRatings(
          homeReturnAPIData,
          awayReturnAPIData,
        );
        setNextMatchWithRating(nextMatchWithRatingRes);
      }
    })();
  }, []);

  useEffect(() => {
    let timerId: any;
    if (timeLeftToNextMatch > 0) {
      timerId = setInterval(() => {
        setTimeLeftToNextMatch((prev) => prev - 1000);
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, []);

  return nextMatchFound ? (
    <div>
      <div id="currentLiveMatch">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="font-bold text-4xl text-main text-nowrap">
            Current Live Match
          </h1>
          <CustomButton
            label="Refresh match"
            className="rounded-full py-1 px-2 max-w-36"
          />
        </div>
        {nextMatchWithRating ? (
          <LiveMatchSection nextMatch={nextMatchWithRating} />
        ) : nextMatchMapped ? (
          <LiveMatchSection nextMatch={nextMatchMapped} />
        ) : (
          <PageLoader />
        )}
      </div>
      <CustomSeparator withText={false} />
      <div id="upcomingMatches">
        <h1 className="font-bold text-4xl text-main mb-4">Upcoming Matches</h1>
        <div className="flex flex-row justify-center items-center gap-4">
          {upcomingMatches !== -1 && upcomingMatches.length > 0 ? (
            upcomingMatches.map((upcomingMatch, index) => (
              <UpcomingMatch key={index} matchInfo={upcomingMatch} />
            ))
          ) : (
            <p>There are no matches left for this competitions</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center">Match non trovato</div>
  );
};
