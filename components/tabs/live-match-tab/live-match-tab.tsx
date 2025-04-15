import { useState, useEffect } from 'react';
import { CustomButton } from '@/components/custom/custom-button';
import { UpcomingMatch } from '@/components/tabs/live-match-tab/upcoming-match';
import { LiveMatchSection } from '@/components/tabs/live-match-tab/live-match-section';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { GameResult } from '@/data/matches/use-set-matches';
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
    getAllPastMatches,
    pastMatchesNotCalculated,
    getMatchRatings,
  } = useGetMatches();
  const { writeGameResults } = useSetMatches();
  const { getAllTeams } = useGetTeams();
  const upcomingMatches = getUpcomingMatches(5);

  const [timeLeftToNextMatch, setTimeLeftToNextMatch] = useState<number>(
    getTimeToNextMatch(),
  );
  const [nextMatchFound, setNextMatchFound] = useState(false);

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
      const homeReturnAPIData = await getSportmonksPlayersDataByIds(
        homePlayerIds,
      );
      const awayReturnAPIData = await getSportmonksPlayersDataByIds(
        awayPlayerIds,
      );
      if (!homeReturnAPIData && !awayReturnAPIData) return;
      const tempNextMatch = {
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

  // TODO: to review this since it causes an infinite refresh for the children components, ending in even a crash (in this case one fetches an api, which could cause a unnecessary usage of it)
  // useEffect(() => {
  //   let timerId: any;
  //   if (timeLeftToNextMatch > 0) {
  //     timerId = setInterval(() => {
  //       setTimeLeftToNextMatch((prev) => prev - 1000);
  //     }, 1000);
  //   }

  //   return () => clearInterval(timerId);
  // }, []);

  async function calculateMatches() {
    if (!nextMatchMapped) {
      console.error("Can't calculate score without mapped players");
      return;
    }
    const allTeams = await getAllTeams();
    if (!allTeams) return;
    const teamPlayersMap: Map<String, any[]> = new Map();
    await Promise.all(
      allTeams.map(async (team) => {
        const players = await getSportmonksPlayersDataByIds(
          team.players.map((player) => player.sportmonksId),
        );
        teamPlayersMap.set(team.shortId, players);
      }),
    );
    const pastMatchesWithoutScore = getAllPastMatches();
    const resultsByWeek: Record<string, GameResult[]> = {};
    for (const week of Object.keys(pastMatchesWithoutScore)) {
      const weekMatches = pastMatchesWithoutScore[week];
      const weekResult: GameResult[] = [];
      for (const match of weekMatches) {
        const matchResult = await getMatchRatings(
          teamPlayersMap.get(match.home.shortId) as any,
          teamPlayersMap.get(match.away.shortId) as any,
          match,
        );
        const gameResult: GameResult = {
          home: {
            shortId: match.home.shortId,
            result: matchResult.result.home,
          },
          away: {
            shortId: match.away.shortId,
            result: matchResult.result.away,
          },
        };
        weekResult.push(gameResult);
      }
      resultsByWeek[week] = weekResult;
    }
    for (const week of Object.keys(resultsByWeek)) {
      const weekGameResult = resultsByWeek[week];
      await writeGameResults(weekGameResult, Number(week));
    }
  }

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
                handleClick={calculateMatches}
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
