import { useState, useEffect } from 'react';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomSeparator } from '@/components/custom/custom-separator';
import { UpcomingMatch } from '@/components/tabs/live-match-tab/upcoming-match';
import { LiveMatchSection } from '@/components/tabs/live-match-tab/live-match-section';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { PageLoader } from '@/components/page-loader';
import { GameResult } from '@/data/matches/use-set-matches';
import { useSetMatches } from '@/data/matches/use-set-matches';
import { EmptyMessage } from './empty-message';

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
  const { getAllTeams, getPlayersSportmonksData } = useGetTeams();
  const upcomingMatches = getUpcomingMatches(5);

  const [timeLeftToNextMatch, setTimeLeftToNextMatch] = useState<number>(
    getTimeToNextMatch(),
  );
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
        const players = await getPlayersSportmonksData(
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

  return nextMatchFound ? (
    <div>
      <div id="currentLiveMatch">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="font-bold text-4xl text-main text-nowrap">
            Current Live Match
          </h1>
          {/*
            I comment it because ATM to refresh you can just swith tabs and it will load again,
            later we will cache the result (maybe) and there a refresh is going to be needed
          <CustomButton
            label="Refresh match"
            className="rounded-full py-1 px-2 max-w-36"
          />
          */}
          {pastMatchesNotCalculated() && (
            <CustomButton
              label="Calculate Results"
              className="rounded-full py-1 px-2 max-w-40"
              handleClick={calculateMatches}
            />
          )}
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
    <EmptyMessage
      title="Match not found 🤷‍♂️"
      description="Ask your admin to generate the matches to start following the live results."
    />
  );
};
