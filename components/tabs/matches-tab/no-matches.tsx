import { CustomButton } from '@/components/custom/custom-button';
import { useAppSelector } from '@/store/hooks';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';

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
    <div>
      <section className="bg-white">
        <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
          <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl">
            Looks like there are no matches yet...
          </h2>

          <p className="max-w-4xl mt-6 text-center text-gray-500">
            {textForNoMatches}
            <br />
            <strong>Attention:</strong> Once you start a competition you cannot
            add any more Teams or Players.
          </p>

          {leagueAdmin === user.id && (
            <div className="inline-flex w-full mt-6 sm:w-auto">
              <CustomButton
                label="Generate Match Schedule"
                handleClick={generateMatchSchedule}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
