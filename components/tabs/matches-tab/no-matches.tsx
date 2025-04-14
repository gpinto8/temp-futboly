import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { EmptyMessage } from '@/components/empty-message';
import { useEffect, useState } from 'react';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useGetUsers } from '@/data/users/use-get-users';
import { TEAMS_PLAYERS_LIMIT } from '@/firebase/db-types';
import { useGetMatches } from '@/data/matches/use-get-matches';

export const NoMatches = () => {
  const { getUser } = useGetUsers();
  const { getLeague } = useGetLeagues();
  const { getActiveCompetition } = useGetCompetitions();
  const { scheduleCompetitionMatches } = useSetCompetitions();
  const { validMatchGeneration } = useGetMatches();

  const [ctaButtonDisabled, setCtaButtonDisabled] = useState(true);

  const currentCompetitionId = getActiveCompetition()?.id;
  const isAdmin = getLeague()?.owner === getUser().id;

  useEffect(() => {
    (async () => {
      if (currentCompetitionId) {
        const isValid = await validMatchGeneration(currentCompetitionId);
        setCtaButtonDisabled(!isValid);
      }
    })();
  }, [currentCompetitionId]);

  const generateMatchSchedule = async () => {
    if (currentCompetitionId)
      await scheduleCompetitionMatches(currentCompetitionId);
  };

  return (
    <EmptyMessage
      title="Looks like there are no matches yet ... 🤨"
      description={
        isAdmin ? (
          <div className="flex flex-col gap-2">
            In order to generate the matches, you need to:
            <ul className="flex flex-col">
              <li>1. Select a competition.</li>
              <li>
                2. Have teams even and {TEAMS_PLAYERS_LIMIT} plSayers in each of
                them.
              </li>
              <li>
                3. Make sure the teams have a formation and its players are
                positioned.
              </li>
            </ul>
            <span className="pt-2">
              <strong>Attention:</strong> Once you generate the matches, you
              cannot add any more teams or players.
            </span>
          </div>
        ) : (
          'Ask your admin to generate the matches.'
        )
      }
      ctaButton={
        isAdmin
          ? {
              label: 'Generate Match Schedule',
              handleClick: generateMatchSchedule,
              disabled: ctaButtonDisabled,
            }
          : undefined
      }
    />
  );
};
