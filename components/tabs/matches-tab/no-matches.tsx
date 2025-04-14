import { useAppSelector } from '@/store/hooks';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { EmptyMessage } from '@/components/empty-message';
import { useEffect, useState } from 'react';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useGetUsers } from '@/data/users/use-get-users';

export const NoMatches = () => {
  const { getUser } = useGetUsers();
  const { getLeague } = useGetLeagues();
  const { getCompetitionById, getActiveCompetition } = useGetCompetitions();
  const { scheduleCompetitionMatches } = useSetCompetitions();

  const [ctaButtonDisabled, setCtaButtonDisabled] = useState(true);

  const currentCompetitionId = getActiveCompetition()?.id;
  const isAdmin = getLeague()?.owner === getUser().id;

  useEffect(() => {
    (async () => {
      if (currentCompetitionId) {
        const currentCompetition =
          await getCompetitionById(currentCompetitionId);
        const teams = currentCompetition?.teams;
        const teamsEven = (teams?.length || 0) % 2 === 0;
        const atLeastAPlayer = teams?.every((team) => team.players.length);

        // Enable the button only (1) if a any competition is selected and (2) if the teams are even and (3) if there is at least one players in every team // TODO: make sure there i sthe minimum: 11
        const disabled = !(currentCompetition && teamsEven && atLeastAPlayer);
        setCtaButtonDisabled(disabled);
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
            In order to generate the matches, you need to select a competition,
            have its teams even and some players in it.
            <span>
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
