import {
  MappedCompetitionsProps,
  MatchScheduleProps,
  TEAMS_PLAYERS_LIMIT,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { useAppSelector } from '@/store/hooks';
import { useGetTeams } from '../teams/use-get-teams';
import { DAY_OF_WEEK_MATCH, DEFAULT_SCORE } from '@/firebase/config';
import { fetchSportmonksApi } from '@/sportmonks/fetch-sportmonks-api';
import { CompetitionsCollectionTeamsExtraProps } from '../teams/use-get-teams';
import { useGetCompetitions } from '../competitions/use-get-competitions';

export const useGetMatches = () => {
  const { getTeamByUid } = useGetTeams();
  const { getCompetitionById } = useGetCompetitions();
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

  // Returns personal statistics looping through all the matches and aggregating all the information needed in each step
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
    } as MatchStatistics;
  };

  // Return all the matches but sorted by week
  const getAllMatches = () => {
    if (!matches) return [];
    const matchesClone = [...matches];
    let grouped = groupMatchesByWeek(matchesClone);
    const keys = Object.keys(grouped);
    const groupedMatches = keys.map((key) => {
      return {
        week: key,
        matches: grouped[key],
      };
    });
    return groupedMatches;
  };

  // Returns all past matches that do not have a result
  const getAllPastMatchesWithoutResult = () => {
    if (!matches) return;
    if (!pastMatchesNotCalculated()) return;
    const todayTime = new Date().getTime();
    const pastMatches = [...matches]
      .filter((match) => new Date(match.date).getTime() < todayTime)
      .filter((pastMatches) => !Boolean(pastMatches.result));
    return groupMatchesByWeek(pastMatches);
  };

  // Returns a boolean that tells you if there are past matches not calculated
  const pastMatchesNotCalculated = () => {
    if (!matches) return;
    const todayTime = new Date().getTime();
    return [...matches]
      .filter((match) => new Date(match.date).getTime() < todayTime)
      .filter((pastMatches) => !Boolean(pastMatches.result)).length > 0
      ? true
      : false;
  };

  // Returns all the matches that are going to follow, You need to put how many you need and you will get maximum matchesNumber elements
  // But if less elements are available then the result will be less
  // You will receive -1 if there are no more matches
  const getUpcomingMatches = (matchesNumber: number) => {
    if (!matches) return [];
    const personalMatches = getPersonalMatches(); // Gives back an ordered array so I don't need to sort it again
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

  // Returns ms to next match
  const getTimeToNextMatch = () => {
    const start = new Date().getTime();
    return getNextMatchDay() - start;
  };

  // Gets the next match and it returns the basic info plus the mapped teams
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

  // Returns the rating LIVE given an array of mapped players home/away
  const getNextMatchRatings = async (home: any[], away: any[]) => {
    const nextPersonalMatch: MatchScheduleProps | -1 = getUpcomingMatches(1)[0];
    if (!nextPersonalMatch) return;
    if (nextPersonalMatch === -1) return -1;
    // if (getTimeToNextMatch() === -1) {  // If the match is already started I check the ratings of the players --> Commented because I am checking in the component
    const matchRatings = await getMatchRatings(
      home,
      away,
      nextPersonalMatch,
      true,
    );
    return {
      ...nextPersonalMatch,
      home: {
        ...nextPersonalMatch.home,
        playersAPI: matchRatings.home,
      },
      away: {
        ...nextPersonalMatch.away,
        playersAPI: matchRatings.away,
      },
      result: matchRatings.result,
    };
  };

  const getMatchRatings = async (
    home: any[],
    away: any[],
    match: MatchScheduleProps,
    isLive: boolean,
  ) => {
    // For home and away maps all the players to respective team, so you have a structure like {teamId: playersId[]}
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
    // Given the match date I will extract the lower and upper bound
    const { previousFriday: startDate, nextFriday: endDate } =
      getFridaysFromDate(match.date);
    // I will get the rating of all the players
    home = await assignTeamRating(
      homeTeamPlayersMap,
      home,
      startDate,
      endDate,
      isLive,
    );
    away = await assignTeamRating(
      awayTeamPlayersMap,
      away,
      startDate,
      endDate,
      isLive,
    );
    // After getting the rating of every player I calculate also the result
    const homeScore = home.reduce(
      (prev, curr) => prev + Number(curr.score || 0),
      0,
    );
    const awayScore = away.reduce(
      (prev, curr) => prev + Number(curr.score || 0),
      0,
    );
    return {
      ...match,
      home,
      away,
      result: {
        home: homeScore,
        away: awayScore,
      },
    };
  };

  // CHECK IF THE COMPETITION MEETS THE REQUIREMENTS TO GENERATE THE MATCHES OR NOT
  const validMatchGeneration = async (competitionId: string) => {
    /* The requirements are: 
      1. A competition has to be selected
      2. Teams gotta be even
      3. There needs to be 11 players for each team
      4. Each team need to have a formation
      5. Each team need to have its players positioned based on the choosed formation (aka the football field circles have to be filled, in other words)
    */

    const currentCompetition = await getCompetitionById(competitionId); // 1.
    const teams = currentCompetition?.teams;

    const teamsAreEven = teams?.length && (teams.length || 0) % 2 === 0; // 2.
    const teamsHaveLimitPlayers =
      teams?.length &&
      teams.every((team) => team.players.length === TEAMS_PLAYERS_LIMIT); // 3.
    const teamsHaveFormation =
      teams?.length && teams.every((team) => team.formation); // 4.
    const teamsHavePlayersPositioned =
      teams?.length &&
      teams.every((team) => team.players.every((player) => player.position)); // 5.

    const isValid =
      currentCompetition &&
      teamsAreEven &&
      teamsHaveLimitPlayers &&
      teamsHaveFormation &&
      teamsHavePlayersPositioned;

    return isValid;
  };

  return {
    getPersonalMatches,
    getMatchStatistics,
    getAllMatches,
    getUpcomingMatches,
    getTimeToNextMatch,
    getNextMatch,
    getNextMatchRatings,
    getAllPastMatchesWithoutResult,
    pastMatchesNotCalculated,
    getMatchRatings,
    validMatchGeneration,
  };
};

// It will check if it's the match day returns -1 otherwise the timestamp of the next match
export function getNextMatchDay() {
  const HOURS = 16;
  const today = new Date(Date.now());
  const todayDay = today.getUTCDay();

  const todayHours = today.getUTCHours();
  if (todayDay === 6 || todayDay === 0) return -1;
  if (todayDay === DAY_OF_WEEK_MATCH && todayHours >= HOURS) return -1;

  let daysLeft = DAY_OF_WEEK_MATCH - todayDay;
  today.setUTCDate(today.getDate() + daysLeft);
  today.setUTCHours(HOURS);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);

  return today.getTime();
}

function groupMatchesByWeek(schedule) {
  return schedule.reduce((acc, curr) => {
    acc[curr.week] = acc[curr.week] || [];
    acc[curr.week].push(curr);
    return acc;
  }, {} as any);
}

export function getFridaysFromDate(inputDate: Date | string): {
  previousFriday: DateString;
  nextFriday: DateString;
} {
  const date = new Date(inputDate);

  // Find previous Friday
  const previousFriday = new Date(date);
  previousFriday.setDate(date.getDate() - ((date.getDay() + 2) % 7));

  // Find next Friday
  const nextFriday = new Date(previousFriday);
  nextFriday.setDate(previousFriday.getDate() + 7);

  const formatDate = (d: Date): DateString => {
    return d.toISOString().split('T')[0] as DateString;
  };

  return {
    previousFriday: formatDate(previousFriday),
    nextFriday: formatDate(nextFriday),
  };
}

// If the match is live then I assign 0 if no result is found, if is not live (I am calculating end of week results)
// Then I assign the DEFAULT_SCORE to a player with no available results
async function assignTeamRating(
  teamPlayersMap: any,
  originalTeam: any,
  startDate: DateString,
  endDate: DateString,
  isLive: boolean,
) {
  // Mapping all the keys of the array that correspond to the team and returns a promise to resolve in next step
  const teamPromises = Object.keys(teamPlayersMap).map(async (team) => {
    const DEFAULT_MATCH_SCORE = isLive ? 0 : DEFAULT_SCORE;
    if (team === 'undefined') {
      // For each player that doesn't have a team I will assign the default
      teamPlayersMap[team].forEach((playerId: any) => {
        originalTeam.forEach((originalPlayer: any) => {
          if (originalPlayer.id === playerId) {
            originalPlayer.score = DEFAULT_MATCH_SCORE;
          }
        });
      });
      return Promise.resolve(); // Returns resolved promise
    } else {
      // A team is found so I get it's latest fixture
      const teamLastResult = await getTeamLatestFixture(
        startDate,
        endDate,
        Number.parseInt(team),
      );
      if (teamLastResult !== -1) {
        // Means Fixture Found
        teamPlayersMap[team].forEach((playerId: any) => {
          originalTeam.forEach((originalPlayer: any) => {
            if (originalPlayer.id === playerId) {
              const playerLineup = teamLastResult.lineups?.filter(
                (lineupPlayer: any) => lineupPlayer.player_id === playerId,
              );
              // If the player was in the lineup I check his details otherwise I will assign the default
              if (playerLineup?.length !== 0) {
                const playerScoreDetails = playerLineup[0]?.details?.filter(
                  (detail: any) => detail.type_id === 118,
                );
                // If the player has a score I will extract it otherwise I will assign the default
                if (playerScoreDetails?.length !== 0) {
                  const playerScore = playerScoreDetails[0].data?.value;
                  originalPlayer.score = playerScore ?? DEFAULT_MATCH_SCORE;
                } else {
                  originalPlayer.score = DEFAULT_MATCH_SCORE;
                }
              } else {
                originalPlayer.score = DEFAULT_MATCH_SCORE;
              }
            }
          });
        });
      } else {
        // If match is not found that I assign the default
        teamPlayersMap[team].forEach((playerId: any) => {
          originalTeam.forEach((originalPlayer: any) => {
            if (originalPlayer.id === playerId) {
              originalPlayer.score = DEFAULT_MATCH_SCORE;
            }
          });
        });
      }
      return Promise.resolve(); // Returns resolved promise
    }
  });

  await Promise.all(teamPromises);
  return originalTeam;
}

// Checks if given two dates and a teamId there are any fixtures. -1 means no fixtures found
async function getTeamLatestFixture(
  date1: DateString,
  date2: DateString,
  teamId: number,
) {
  if (date1 && !isValidDateString(date1)) {
    console.error(`date1 non è una data valida: ${date1}`);
  }
  if (date2 && !isValidDateString(date2)) {
    console.error(`date2 non è una data valida: ${date2}`);
  }
  const result = await fetchSportmonksApi(
    'football/fixtures/between',
    `${date1}/${date2}/${teamId}`,
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

export type MatchStatistics = {
  totalWins: number;
  totalMatchPlayed: number;
  overallScore: number;
  scoredThisWeek: number;
};

export type LiveMatchProps = {
  home: CompetitionsCollectionTeamsExtraProps & { playersAPI: any };
  away: CompetitionsCollectionTeamsExtraProps & { playersAPI: any };
  date: Date;
  week: number;
  result?: {
    home: number;
    away: number;
  };
};
