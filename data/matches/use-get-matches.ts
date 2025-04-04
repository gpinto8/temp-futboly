import {
  MappedCompetitionsProps,
  MatchScheduleProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { useAppSelector } from '@/store/hooks';
import { useGetTeams } from '../teams/use-get-teams';
import { DAY_OF_WEEK_MATCH, DEFAULT_SCORE } from '@/firebase/config';
import { fetchSportmonksApi } from '@/sportmonks/fetch-sportmonks-api';
import { CompetitionsCollectionTeamsExtraProps } from '../teams/use-get-teams';

export const useGetMatches = () => {
  const { getTeamByUid } = useGetTeams();
  const activeCompetition = useAppSelector(
    (state) => state.competition.activeCompetition,
  ) as MappedCompetitionsProps;
  const user = useAppSelector((state) => state.user) as UsersCollectionProps;
  const matches = activeCompetition ? activeCompetition.matchSchedule : null;

  // Return personal matches ordered by week
  const getPersonalMatches = () => {
    if (!matches) return [];
    return [...matches]
      .filter(
        (match) =>
          match.home.userId === user.id || match.away.userId === user.id,
      )
      .sort((a, b) => a.week - b.week);
  };

  const getMatchStatistics = () => {
    const personalMatches = getPersonalMatches();
    let totalWins = 0,
      totalMatchPlayed = 0,
      totalScore = 0,
      scoredThisWeek = 0;
    personalMatches.forEach((personalMatch) => {
      const matchSide = personalMatch.home.userId === user.id ? 'Home' : 'Away';
      if (personalMatch.result) {
        totalMatchPlayed++; // If match has a result
        const winnerSide =
          personalMatch.result.home > personalMatch.result.away
            ? 'Home'
            : personalMatch.result.home !== personalMatch.result.away
              ? 'Away'
              : 'Draw';
        if (winnerSide === matchSide) totalWins++;
        totalScore += personalMatch.result[matchSide.toLowerCase()];
        scoredThisWeek = personalMatch.result[matchSide.toLowerCase()];
      }
    });
    return {
      totalWins,
      totalMatchPlayed,
      overallScore: Math.round(totalScore / totalMatchPlayed),
      scoredThisWeek,
    } as matchStatistics;
  };

  // Return all the matches but sorted by week
  const getAllMatches = () => {
    if (!matches) return [];
    const matchesClone = [...matches];
    let grouped = matchesClone.reduce((acc, curr) => {
      acc[curr.week] = acc[curr.week] || [];
      acc[curr.week].push(curr);
      return acc;
    }, {} as any);
    const keys = Object.keys(grouped);
    const groupedMatches = keys.map((key) => {
      return {
        week: key,
        matches: grouped[key],
      };
    });
    return groupedMatches;
  };

  const getUpcomingMatches = (matchesNumber: number) => {
    if (!matches) return [];
    const personalMatches = getPersonalMatches();
    const upcomingPersonalMatches = personalMatches.filter(
      (match) => !match.result,
    );
    if (upcomingPersonalMatches.length === 0) return -1;
    if (upcomingPersonalMatches.length > matchesNumber) {
      return upcomingPersonalMatches.slice(0, matchesNumber);
    } else {
      return upcomingPersonalMatches;
    }
  };

  const getTimeToNextMatch = () => {
    const HOURS = 16;
    const today = new Date(Date.now());
    const todayDay = today.getUTCDay();
    const todayHours = today.getUTCHours();
    if (todayDay === 6 || todayDay === 0) return -1;
    if (todayDay === DAY_OF_WEEK_MATCH && todayHours >= HOURS) return -1;
    let daysLeft = DAY_OF_WEEK_MATCH - todayDay;
    const start = today.getTime();
    today.setUTCDate(today.getDate() + daysLeft);
    today.setUTCHours(HOURS);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    return today.getTime() - start;
  };

  const getNextMatch = () => {
    const nextPersonalMatch: MatchScheduleProps | -1 = getUpcomingMatches(1)[0];
    if (!nextPersonalMatch) return;
    if (nextPersonalMatch === -1) return -1;
    const homeUserId = nextPersonalMatch.home.userId;
    const awayUserId = nextPersonalMatch.away.userId;
    if (!homeUserId || !awayUserId) return;
    const homeTeam = getTeamByUid(homeUserId);
    const awayTeam = getTeamByUid(awayUserId);
    if (!homeTeam || !awayTeam) return;
    return {
      ...nextPersonalMatch,
      home: homeTeam,
      away: awayTeam,
    };
  };

  const getNextMatchRatings = async (home: any[], away: any[]) => {
    const nextPersonalMatch: MatchScheduleProps | -1 = getUpcomingMatches(1)[0];
    if (!nextPersonalMatch) return;
    if (nextPersonalMatch === -1) return -1;
    // if (getTimeToNextMatch() === -1) {  // If the match is already started I check the ratings of the players --> Commented because I am checking in the component
    const homeTeamPlayersMap = home.reduce((acc: any, player: any) => {
      if (!acc[player.teams[0]?.team_id]) acc[player.teams[0]?.team_id] = [];
      acc[player.teams[0]?.team_id].push(player.id);
      return acc;
    }, {});
    const awayTeamPlayersMap = away.reduce((acc: any, player: any) => {
      if (!acc[player.teams[0]?.team_id]) acc[player.teams[0]?.team_id] = [];
      acc[player.teams[0]?.team_id].push(player.id);
      return acc;
    }, {});
    home = await assignTeamRating(homeTeamPlayersMap, home);
    away = await assignTeamRating(awayTeamPlayersMap, away);
    //}
    const homeScore = home.reduce((prev, curr) => (prev += curr.score));
    const awayScore = away.reduce((prev, curr) => (prev += curr.score));
    return {
      ...nextPersonalMatch,
      home,
      away,
      result: {
        home: homeScore,
        away: awayScore,
      },
    };
  };

  return {
    getPersonalMatches,
    getMatchStatistics,
    getAllMatches,
    getUpcomingMatches,
    getTimeToNextMatch,
    getNextMatch,
    getNextMatchRatings,
  };
};

async function assignTeamRating(teamPlayersMap: any, originalTeam: any) {
  Object.keys(teamPlayersMap).forEach(async (team) => {
    if (team === 'undefined') {
      // For each player that doesn't have a team I will assign the default
      teamPlayersMap[team].forEach((playerId) => {
        originalTeam.forEach((originalPlayer) => {
          if (originalPlayer.id === playerId) {
            originalPlayer.score = DEFAULT_SCORE;
          }
        });
      });
    } else {
      const teamLastResult = await getTeamLatestFixture(
        '2025-03-15',
        '2025-04-03',
        Number.parseInt(team),
      );
      if (teamLastResult !== -1) {
        // Means Fixture Found
        teamPlayersMap[team].forEach((playerId) => {
          originalTeam.forEach((originalPlayer) => {
            if (originalPlayer.id === playerId) {
              const playerLineup = teamLastResult.lineups?.filter(
                (lineupPlayer) => lineupPlayer.player_id === playerId,
              );
              const playerScoreDetails = playerLineup[0]?.details?.filter(
                (detail) => detail.type_id === 118,
              );
              if (playerScoreDetails) {
                const playerScore = playerScoreDetails[0].data?.value;
                originalPlayer.score = playerScore ?? DEFAULT_SCORE;
              } else {
                originalPlayer.score = DEFAULT_SCORE;
              }
            }
          });
        });
      } else {
        // If match is not found that I assign the default
        teamPlayersMap[team].forEach((playerId) => {
          originalTeam.forEach((originalPlayer) => {
            if (originalPlayer.id === playerId) {
              originalPlayer.score = DEFAULT_SCORE;
            }
          });
        });
      }
    }
  });
  return originalTeam;
}

async function getTeamLatestFixture(
  date1: DateString,
  date2: DateString,
  team: number,
) {
  if (date1 && !isValidDateString(date1)) {
    console.error(`date1 non è una data valida: ${date1}`);
  }
  if (date2 && !isValidDateString(date2)) {
    console.error(`date2 non è una data valida: ${date2}`);
  }
  const result = await fetchSportmonksApi(
    'football/fixtures/between',
    `${date1}/${date2}/${team}`,
    undefined,
    undefined,
    'filters=lineupDetailTypes:118',
  );
  if (result.data && result.data?.length > 0) {
    // If I have a match I will sort them by date and pick the most recent otherwise return -1
    return Array.from(result.data).sort(
      (a: any, b: any) => b.starting_at_timestamp - a.starting_at_timestamp,
    )[0] as any;
  } else {
    return -1;
  }
}

type DateString = `${number}-${number}-${number}`;

const isValidDateString = (date: string): date is DateString => {
  return /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(date);
};

export type matchStatistics = {
  totalWins: number;
  totalMatchPlayed: number;
  overallScore: number;
  scoredThisWeek: number;
};

export type LiveMatchProps = {
  home: Omit<CompetitionsCollectionTeamsExtraProps, 'players'> & {
    players: any;
  };
  away: Omit<CompetitionsCollectionTeamsExtraProps, 'players'> & {
    players: any;
  };
  date: Date;
  week: number;
  result?: {
    home: number;
    away: number;
  };
};
