import { useState, useEffect } from 'react';
import { CustomButton } from '@/components/custom/custom-button';
import { UpcomingMatch } from '@/components/tabs/live-match-tab/upcoming-match';
import { LiveMatchSection } from '@/components/tabs/live-match-tab/live-match-section';
import { LiveMatchProps, useGetMatches } from '@/data/matches/use-get-matches';
import { useSetMatches } from '@/data/matches/use-set-matches';
import { EmptyMessage } from '../../empty-message';
import { Loader } from '../../loader';
import { getSportmonksPlayersDataByIds } from '@/sportmonks/common-methods';
import { TabSectionSpacer } from '../tab-section-spacer';

export const LiveMatch = () => {
  const {
    getUpcomingMatches,
    getTimeToNextMatch,
    getNextMatch,
    getNextMatchRatings,
    pastMatchesNotCalculated,
  } = useGetMatches();
  const { calculateMatches } = useSetMatches();
  const upcomingMatches = getUpcomingMatches(5);

  const [nextMatchFound, setNextMatchFound] = useState(false);

  const [nextMatchMapped, setNextMatchMapped] = useState<LiveMatchProps>();
  const [nextMatchWithRating, setNextMatchWithRating] =
    useState<LiveMatchProps>();

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

      const homeReturnAPIData = await getSportmonksPlayersDataByIds(
        homePlayerIds,
      );
      const awayReturnAPIData = await getSportmonksPlayersDataByIds(
        awayPlayerIds,
      );
      if (!homeReturnAPIData && !awayReturnAPIData) return;

      const tempNextMatch: LiveMatchProps = {
        ...nextMatch,
        home: {
          ...nextMatch.home,
          playersAPI: homeReturnAPIData,
        },
        away: {
          ...nextMatch.away,
          playersAPI: awayReturnAPIData,
        },
      };
      setNextMatchMapped(tempNextMatch);

      const timeToStart = getTimeToNextMatch();
      if (timeToStart < 1) {
        const ratings = await getNextMatchRatings(
          homeReturnAPIData,
          awayReturnAPIData,
        );

        if (ratings !== -1) {
          const result = ratings?.result as LiveMatchProps['result'];
          const home = {
            ...tempNextMatch.home,
            playersAPI: ratings?.home?.playersAPI,
          };
          const away = {
            ...tempNextMatch.away,
            playersAPI: ratings?.away?.playersAPI,
          };

          setNextMatchWithRating({ ...tempNextMatch, away, home, result });
        }
      }
    })();
  }, []);

  return (
    <TabSectionSpacer
      firstSection={{
        title: 'Live Match',
        TitleEndComponent: () => (
          <>
            {pastMatchesNotCalculated() && (
              <CustomButton
                label="Calculate Results"
                className="rounded-full py-1 px-2 max-w-40"
                handleClick={() => calculateMatches(nextMatchMapped as any)}
              />
            )}
          </>
        ),
        Component: () =>
          nextMatchWithRating ? (
            <LiveMatchSection nextMatch={nextMatchWithRating} />
          ) : nextMatchMapped ? (
            <LiveMatchSection nextMatch={nextMatchMapped} />
          ) : (
            <div className="flex justify-center items-center h-40">
              <Loader color="main" />
            </div>
          ),
      }}
      secondSection={{
        title: 'Upcoming Matches',
        Component: () => (
          <div className="flex flex-row items-center gap-4 flex-wrap">
            {upcomingMatches !== -1 && upcomingMatches.length > 0 ? (
              upcomingMatches.map((upcomingMatch, index) => (
                <UpcomingMatch key={index} matchInfo={upcomingMatch} />
              ))
            ) : (
              <p>There are no matches left for this competitions</p>
            )}
          </div>
        ),
      }}
      emptyMessage={{
        condition: !nextMatchFound,
        Component: () => (
          <EmptyMessage
            title="Match not found 🤷‍♂️"
            description="Ask your admin to generate the matches to start following the live results."
          />
        ),
      }}
    />
  );
};
