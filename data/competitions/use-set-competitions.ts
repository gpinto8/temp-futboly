import { firestoreMethods } from '@/firebase/firestore-methods';
import {
  CompetitionsCollectionProps,
  UsersCollectionProps,
  MappedCompetitionsProps,
  ShortTeamProps,
} from '@/firebase/db-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { competitionActions } from '@/store/slices/competitions';
import { DocumentReference } from 'firebase/firestore';
import { useGetCompetitions } from './use-get-competitions';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { DAY_OF_WEEK_MATCH } from '@/firebase/config';

export const useSetCompetitions = () => {
  const user = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.league);
  const dispatch = useAppDispatch();
  const { mapTeamWithExtraProps } = useGetTeams();
  const {
    getCompetitions,
    getActiveCompetition,
    getCompetitionById,
    getCompetitionsByLeagueId,
    getActiveCompetitionByUid,
  } = useGetCompetitions();

  // SET ALL FETCHED COMPETITIONS TO THE REDUX STATE
  const setCompetitions = async (leagueId: string) => {
    if (leagueId) {
      const competitions = await getCompetitionsByLeagueId(leagueId);
      if (competitions) {
        dispatch(competitionActions.setAllCompetitions(competitions));
      }

      const activeCompetition = await getActiveCompetitionByUid(leagueId, user);
      if (activeCompetition) {
        dispatch(competitionActions.setActiveCompetition(activeCompetition));
      }
    }
  };

  // ADD A COMPETITION TO CURRENT LEAGUE
  const addCompetition = async (
    competition?: Omit<CompetitionsCollectionProps, 'id'>,
  ) => {
    if (competition) {
      if (!(competition.players.length > 0)) {
        const userRef: DocumentReference<UsersCollectionProps> =
          firestoreMethods(
            'users',
            user.id as any,
          ).getDocRef() as DocumentReference<UsersCollectionProps>;
        competition.players = [userRef];
      }

      const objCreated = await firestoreMethods(
        'competitions',
        'id',
      ).createDocument(competition);

      if (objCreated) {
        dispatch(competitionActions.setCompetition(objCreated));
        return objCreated as CompetitionsCollectionProps;
      }
    } else {
      console.error('No competition data provided');
    }
  };

  const setActiveCompetition = async (
    competitionId: CompetitionsCollectionProps['id'] | undefined,
    user: UsersCollectionProps,
    leagueId: string,
    competition?: CompetitionsCollectionProps | MappedCompetitionsProps,
  ) => {
    const setActiveCompetitionToUser = async (competitionId: string) => {
      const competitionRef = firestoreMethods(
        'competitions',
        competitionId as any,
      ).getDocRef();
      if (!competitionRef) return;

      const createField = user.activeCompetitions ? false : true;
      if (createField) {
        await firestoreMethods('users', user.id as any).createField(
          `activeCompetitions`,
          { [leagueId]: competitionRef },
        );
      } else {
        await firestoreMethods('users', user.id as any).replaceRefField(
          `activeCompetitions.${leagueId}`,
          competitionRef,
        );
      }
    };

    if (competition) {
      await setActiveCompetitionToUser(competition.id as string);
      dispatch(competitionActions.setActiveCompetition(competition));
    } else {
      const competition = await getCompetitionById(competitionId as any);
      if (competition) {
        dispatch(competitionActions.setActiveCompetition(competition));
      }
    }
  };

  // DELETE COMPETITION FROM CURRENT LEAGUE
  const deleteCompetition = async (
    competitionId: CompetitionsCollectionProps['id'],
  ) => {
    // ??
    await firestoreMethods('teams', 'id').deleteDocumentsByQuery(
      'competition',
      '==',
      competitionId,
    );

    // Deletes the object
    await firestoreMethods(
      'competitions',
      competitionId as any,
    ).deleteDocument();

    // Update the redux state
    const competitions = getCompetitions();
    const filteredCompetitions = competitions?.filter(
      (competition) => competition.id !== competitionId,
    );
    dispatch(competitionActions.setAllCompetitions(filteredCompetitions));

    // Checking if the current active competition is being deleted, so we remove its redux state data
    const currentCompetition = getActiveCompetition();
    if (currentCompetition?.id === competitionId) {
      dispatch(competitionActions.setActiveCompetition(undefined));
    }
  };

  const scheduleCompetitionMatches = async (competitionId: string) => {
    // Check if the user is the owner of the league
    if (!(league.owner === user.id)) return;
    const competitionToBeScheduled = await getCompetitionById(competitionId);
    if (!competitionToBeScheduled) return;
    if (competitionToBeScheduled.matchSchedule) {
      console.error("Can't schedule a competition that is already scheduled");
      return;
    }
    const teams = competitionToBeScheduled.teams;
    const mappedTeams = await Promise.all(
      teams.map(async (team) => await mapTeamWithExtraProps(team)),
    );
    const shortMapTeams = mappedTeams.map((mappedTeam) => {
      return {
        name: mappedTeam.name,
        ownerUsername: mappedTeam.ownerUsername,
        shortId: mappedTeam.shortId,
        logoId: mappedTeam.logoId,
        userId: mappedTeam.userId,
      };
    }) as ShortTeamProps[];
    const maxWeek = competitionToBeScheduled.maxWeek;
    const schedule = createRoundRobinSchedule(shortMapTeams, maxWeek);
    if (!schedule) return;
    const finalSchedule = mapHomeAway(
      randomizeWeeks(schedule, teams.length, maxWeek),
    );
    const competitionStart = new Date(
      competitionToBeScheduled.startDate.toDate(),
    );
    const dayOfWeekStart = competitionStart.getDay();
    const finalScheduleWithDate = finalSchedule.map((schedule) => {
      const daysToAdd = (DAY_OF_WEEK_MATCH - dayOfWeekStart + 7) % 7;
      const startCopy = new Date(competitionToBeScheduled.startDate.toDate());
      const totalDaysToAdd = daysToAdd + (schedule.week - 1) * 7;
      startCopy.setDate(totalDaysToAdd);
      return {
        ...schedule,
        date: startCopy.getTime(),
      };
    });
    const result = await firestoreMethods(
      'competitions',
      competitionToBeScheduled.id as any,
    ).replaceField('matchSchedule', finalScheduleWithDate);
    if (!result)
      console.error('Error while scheduling the matches for the competition');
    const updatedCompetition = await getCompetitionById(competitionId);
    if (!updatedCompetition) return;
    dispatch(competitionActions.setCompetition(updatedCompetition));
  };

  return {
    setCompetitions,
    setActiveCompetition,
    addCompetition,
    deleteCompetition,
    scheduleCompetitionMatches,
  };
};

// It is necessary that the number of teams is even, otherwise 1 player would not play
function createRoundRobinSchedule(teams: ShortTeamProps[], maxWeek: number) {
  if (teams.length % 2 !== 0) return null;

  let schedule: Array<{ week: number; match: ShortTeamProps[] }> = [];
  let numTeams = teams.length;

  // Here I create a random inital order for the Teams
  let rotatingTeams = [...shuffleArray(teams)];

  for (let week = 1; week <= maxWeek; week++) {
    let matches: ShortTeamProps[][] = [];

    for (let i = 0; i < numTeams / 2; i++) {
      let team1 = rotatingTeams[i];
      let team2 = rotatingTeams[numTeams - 1 - i];
      matches.push([team1, team2]);
    }
    schedule.push(...matches.map((match) => ({ week, match })));

    // Here I rotate the order of the teams except the first one
    rotatingTeams.splice(1, 0, rotatingTeams.pop()!);
  }
  return schedule;
}

// I can do just n-1 combination of matches, so the nth match is duplicated
// This way I randomize the order of the first n-1 and x(n-1) times
function randomizeWeeks(
  schedule: Array<{ week: number; match: ShortTeamProps[] }>,
  teamsLength: number,
  maxWeek: number,
) {
  let finalSchedule: Array<{ week: number; match: ShortTeamProps[] }> = [];
  for (let i = 1; i <= Math.ceil(maxWeek / (teamsLength - 1)); i++) {
    // Separating block to shuffle
    let partial = schedule.filter(
      (matchSchedule) =>
        matchSchedule.week >= 1 + (teamsLength - 1) * (i - 1) &&
        matchSchedule.week <= (teamsLength - 1) * i,
    );
    // Group all matches of the same week
    let grouped = partial.reduce((acc, curr) => {
      acc[curr.week] = acc[curr.week] || [];
      acc[curr.week].push(curr.match);
      return acc;
    }, {} as any); //Record<number, ShortTeamProps[][]>);
    // Shuffle all the groups
    let shuffled = shuffleArray(Object.values(grouped));
    // Push them into final schedule with randomized order
    for (let week = 1; week <= shuffled.length; week++) {
      shuffled[week - 1].forEach((item) =>
        finalSchedule.push({
          week: (teamsLength - 1) * (i - 1) + week,
          match: item,
        }),
      );
    }
  }
  return finalSchedule;
}

function mapHomeAway(
  schedule: Array<{ week: number; match: ShortTeamProps[] }>,
) {
  return schedule.map((el) => {
    return { week: el.week, home: el.match[0], away: el.match[1] };
  });
}

// Fisher-Yates algorithm to shuffle elements
function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
