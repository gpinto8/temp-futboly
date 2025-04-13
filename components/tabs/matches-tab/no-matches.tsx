import { useAppSelector } from '@/store/hooks';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { EmptyMessage } from '@/components/empty-message';

export const NoMatches = () => {
  const user = useAppSelector((state) => state.user);
  const leagueAdmin = useAppSelector((state) => state.league.owner);
  const currentCompetition = useAppSelector(
    (state) => state.competition.activeCompetition,
  );
  const { scheduleCompetitionMatches } = useSetCompetitions();

  const textForNoMatches =
    leagueAdmin === user.id
      ? "You need to start the competition once all the teams are created and player added. You can't start if the player number is odd."
      : 'You should ask to the administrator of the competition to start it once all the teams are created.';

  const generateMatchSchedule = async () => {
    if (!currentCompetition) {
      console.error('Nessuna competizione selezionata');
      return;
    }
    scheduleCompetitionMatches(currentCompetition.id);
  };

  return (
    <EmptyMessage
      title="Looks like there are no matches yet ... 🤨"
      description={
        <>
          {textForNoMatches}
          <br />
          <strong>Attention:</strong> Once you start a competition you cannot
          add any more Teams or Players.
        </>
      }
      ctaButton={{
        label: 'Generate Match Schedule',
        handleClick: generateMatchSchedule,
      }}
    />
  );
};
