import { useEffect, useState } from 'react';
import { PlayerType } from '@/firebase/db-types';
import { CustomImage } from '@/components/custom/custom-image';

type CustomFieldProps = {
  className?: string;
  players: PlayerType[];
  module: string;
  id?: string;
};

export const CustomField = ({
  id,
  players,
  module,
  className,
}: CustomFieldProps) => {
  const [goalKeeper, setGoalKeeper] = useState<PlayerType | null>(null);
  const [defense, setDefense] = useState<PlayerType[]>([]);
  const [midfield, setMidfield] = useState<PlayerType[]>([]);
  const [forward, setForward] = useState<PlayerType[]>([]);

  useEffect(() => {
    const copyPlayers = [...players].map((player, index) => ({
      ...player,
      pos: index,
    }));
    setGoalKeeper(copyPlayers.splice(0, 1)[0]);
    setDefense(copyPlayers.splice(0, Number(module.split('-')[0])));
    setMidfield(copyPlayers.splice(0, Number(module.split('-')[1])));
    setForward(copyPlayers.splice(0, Number(module.split('-')[2])));
  }, [players, module]);

  return (
    <div
      id={id}
      className={'w-full h-full grid grid-rows-4 ' + className}
      style={{
        backgroundImage: "url('/assets/gray-field.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
      }}
    >
      <div
        id="formation-fw"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        {forward.map((player: any, index) => (
          <PlayerSection key={index} player={player} />
        ))}
      </div>
      <div
        id="formation-mf"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        {midfield.map((player: any, index) => (
          <PlayerSection key={index} player={player} />
        ))}
      </div>
      <div
        id="formation-def"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        {defense.map((player: any, index) => (
          <PlayerSection key={index} player={player} />
        ))}
      </div>
      <div
        id="formation-gk"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        <PlayerSection player={goalKeeper} />
      </div>
    </div>
  );

  /*return (
        <div id="soccerFieldStarting11" className="relative w-full h-full" >
            <CustomImage imageKey="GRAY_FIELD" className="absolute top-0 left-0 z-0 object- w-full h-full" style={{
                height: "692px !important",
                width: "567px !important",
            }}/>
            <div className="relative z-1 w-full h-full">
                CIAO
            </div>
        </div>
    );*/
};

const PlayerSection = ({ player }: { player: PlayerType | null }) => {
  return player ? (
    <div className="border border-black p-1 rounded-full bg-white flex flex-col justify-center items-center size-24">
      <CustomImage
        forceSrc={player.image}
        className={
          'size-10 border rounded-full' +
          (player.isCaptain ? ' border-error-500' : '')
        }
      />
      <p className="font-medium">{player.name.split(' ')[1]}</p>
      <p className="text-gray-500">{player.points} pts</p>
    </div>
  ) : (
    <div className="border border-black p-1 rounded-full bg-white flex flex-col justify-center items-center size-24">
      <p className="font-medium">-</p>
    </div>
  );
};
