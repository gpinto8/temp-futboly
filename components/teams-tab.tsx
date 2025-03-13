import { useEffect, useState } from 'react';
import { CustomImage } from './custom/custom-image';
import { getMockupPersonalTeam, getMockupTeams } from '@/utils/mocks';
import { CustomSeparator } from './custom/custom-separator';
import { CustomCard } from './custom/custom-card';
import { AddEditTeamModal } from './modal/add-edit-team-modal';

const personalTeam = getMockupPersonalTeam();
const allTeams = getMockupTeams();

export const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [cardHeightClass, setCardHeightClass] = useState<string>('');

  useEffect(() => {
    const teamCard = document.getElementById('team-card-0');
    if (teamCard && !cardHeightClass) {
      setCardHeightClass(`h-[${teamCard.clientHeight}px]`);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center my-10">
        <div>You haven't created your team yet.</div>
        <AddEditTeamModal />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="self-start">
          <h1 className="text-2xl md:text-4xl font-bold my-4">Your Team</h1>
          <div className="flex flex-row gap-8 justify-start items-center my-2">
            <CustomImage
              forceSrc={personalTeam.teamLogo}
              className="h-24 w-24"
            />
            <div className="flex flex-col gap-2 justify-start items-center">
              <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-gray-400">Name:</p>
                <p className="font-semibold text-gray-900">
                  {personalTeam.teamName}
                </p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-gray-400">Coach:</p>
                <p className="font-semibold text-gray-900">
                  {personalTeam.owner}
                </p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-gray-400">League Position:</p>
                <p className="font-semibold text-gray-900">
                  {personalTeam.leaguePosition}
                </p>
              </div>
            </div>
          </div>
        </div>
        <CustomSeparator withText={false} />
        <div>
          <h1 className="text-2xl md:text-4xl font-bold my-4">All Teams</h1>
          <div className="grid grid-cols-3 gap-4 auto-rows-fr">
            {allTeams.map((team, index) => (
              <CustomCard
                id={'team-card-' + index}
                key={index}
                style="gray"
                className={selectedTeam === index ? 'row-span-2' : ''}
              >
                <div
                  className="flex flex-col justify-center items-start gap-2"
                  onClick={() =>
                    selectedTeam === index
                      ? setSelectedTeam(null)
                      : setSelectedTeam(index)
                  }
                >
                  <div className="flex justify-start items-center gap-2">
                    <p className="text-xl font-bold">{team.owner}</p>
                    <p className="text-xl">'s team:</p>
                  </div>
                  <div className="flex flex-row gap-8 justify-start items-center my-2">
                    <CustomImage
                      forceSrc={team.teamLogo}
                      className="h-16 w-16"
                    />
                    <div className="flex flex-col gap-2 justify-start items-center">
                      <div className="flex justify-center items-center gap-2">
                        <p className="font-semibold text-gray-400">Name:</p>
                        <p className="font-semibold text-gray-900">
                          {team.teamName}
                        </p>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <p className="font-semibold text-gray-400">Coach:</p>
                        <p className="font-semibold text-gray-900">
                          {team.owner}
                        </p>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <p className="font-semibold text-gray-400">
                          League Position:
                        </p>
                        <p className="font-semibold text-gray-900">
                          {team.leaguePosition}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 px-4 py-2 bg-gray-200 rounded self-center shadow-md hover:scale-105 flex justify-center items-center gap-2">
                    {selectedTeam === index ? 'Hide players' : 'Show players'}
                    <CustomImage
                      imageKey={
                        selectedTeam === index ? 'EXPAND' : 'CLOSE_ICON'
                      }
                      className="h-4 w-4 ml-2"
                    />
                  </button>
                  {selectedTeam === index && (
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
