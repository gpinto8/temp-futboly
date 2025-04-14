import { useEffect, useState } from 'react';
import { PlayerType } from '@/firebase/db-types';
import { CustomImage } from '@/components/custom/custom-image';

type CustomFieldProps = {
    teams: 1 | 2;
  className?: string;
    player_module: {
  players: PlayerType[];
  module: string;
    }[];
  id?: string;
    horizontal?: boolean;
};

export const CustomField = ({
  id,
    player_module,
  className,
    horizontal,
    teams
}: CustomFieldProps) => {

    return player_module.length === 1 && teams === 1 ? (
        <div
            id={id}
            style={{
                backgroundImage: "url('/assets/gray-field.svg')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '100% 100%',
            }}
            className={className}
        >
            <TeamSection players={player_module[0].players} module={player_module[0].module} />
        </div>
        ) : (
        <div
            id={id}
            style={{
                backgroundImage: "url('/assets/gray-field.svg')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '100% 100%',
            }}
            className={className}
        >
            <TeamSection players={player_module[0].players} module={player_module[0].module} isReversed />
            <TeamSection players={player_module[1].players} module={player_module[1].module} />
        </div>
        )

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

const TeamSection = ({players, module, isReversed}: {players: PlayerType[], module: string, isReversed?: boolean}) => {
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

    const teamComposition: any[] = [];
    teamComposition.push(
      <div
        id="formation-fw"
        key={"formation-fw"}
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        {forward.map((player: any, index) => (
          <PlayerSection key={index} player={player} />
        ))}
      </div>
      );
    teamComposition.push(
      <div
        id="formation-mf"
        key="formation-mf"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        {midfield.map((player: any, index) => (
          <PlayerSection key={index} player={player} />
        ))}
      </div>
    );
    teamComposition.push(
      <div
        id="formation-def"
        key="formation-def"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        {defense.map((player: any, index) => (
          <PlayerSection key={index} player={player} />
        ))}
      </div>
        );
    teamComposition.push(
      <div
        id="formation-gk"
        key="formation-gk"
        className="row-span-1 flex w-full h-full justify-around items-center"
      >
        <PlayerSection player={goalKeeper} />
      </div>
        );
return (
    <div
        className={'w-full h-full grid grid-rows-4 '}
    >
            { (!isReversed) ? teamComposition.map(jsxElement => jsxElement) : teamComposition.toReversed().map(jsxElement => jsxElement) }
    </div>
  );
};

const PlayerSection = ({ player }: { player: PlayerType | null }) => {
  return player ? (
    <div className="border border-black p-1 rounded-full bg-white flex flex-col justify-center items-center size-24">
      <CustomImage
        forceSrc={player.image}
        forcedAlt={"player-image-" + player.name}
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
