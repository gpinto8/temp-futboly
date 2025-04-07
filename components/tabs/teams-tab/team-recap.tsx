import { CustomCard } from '@/components/custom/custom-card';
import { CustomImage } from '@/components/custom/custom-image';
import { CustomSeparator } from '@/components/custom/custom-separator';

export const TeamRecap = ({
  team,
  index,
  selectedTeamIndex,
  setSelectedTeamIndex,
}) => {
  return (
    <CustomCard
      id={'team-card-' + index}
      key={index}
      style="gray"
      className={selectedTeamIndex === index ? 'row-span-2' : ''}
    >
      <div
        className="flex flex-col justify-center items-start gap-2"
        onClick={() =>
          selectedTeamIndex === index
            ? setSelectedTeamIndex(null)
            : setSelectedTeamIndex(index)
        }
      >
        <div className="flex justify-start items-center gap-2">
          <p className="text-xl font-bold">{team.owner}</p>
          <p className="text-xl">'s team:</p>
        </div>
        <div className="flex flex-row gap-8 justify-start items-center my-2">
          <CustomImage forceSrc={team.teamLogo} className="h-16 w-16" />
          <div className="flex flex-col gap-2 justify-start items-center">
            <div className="flex justify-center items-center gap-2">
              <p className="font-semibold text-gray-400">Name:</p>
              <p className="font-semibold text-gray-900">{team.teamName}</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="font-semibold text-gray-400">Coach:</p>
              <p className="font-semibold text-gray-900">{team.owner}</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="font-semibold text-gray-400">League Position:</p>
              <p className="font-semibold text-gray-900">
                {team.leaguePosition}
              </p>
            </div>
          </div>
        </div>

        <button className="mt-4 px-4 py-2 bg-gray-200 rounded self-center shadow-md hover:scale-105 flex justify-center items-center gap-2">
          {selectedTeamIndex === index ? 'Hide players' : 'Show players'}
          <CustomImage
            imageKey={selectedTeamIndex === index ? 'EXPAND_ICON' : 'CLOSE_ICON'}
            className="h-4 w-4 ml-2"
          />
        </button>
        {selectedTeamIndex === index && (
          <div className="w-full h-[268px]">
            <CustomSeparator withText={false} />
            <div className="flex justify-around items-center gap-4 text-gray-400 font-medium">
              <div>#</div>
              <div>Player</div>
              <div>Position</div>
              <div>Points</div>
            </div>
            <div className="text-gray-900 font-medium pb-6 h-full overflow-y-auto main-scrollbar">
              {team.players.map((player, index) => (
                <div
                  key={index}
                  className="flex justify-around items-center gap-4"
                >
                  <div>{player.shirtNumber}</div>
                  <div className="flex justify-around items-center gap-2">
                    <CustomImage
                      forceSrc={player.image}
                      className="h-8 w-8 rounded-full border border-black"
                    />
                    <p>{player.name.split(' ')[1]}</p>
                  </div>
                  <div>{player.position}</div>
                  <div>{player.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomCard>
  );
};
