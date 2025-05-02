import { CustomSeparator } from '@/components/custom/custom-separator';
import { Avatar } from '@mui/material';

type LineupTableProps = {
  className: string;
  teamName: string;
  players: any;
  reverse?: boolean;
};

export const LineUpTable = ({
  className,
  teamName,
  players,
  reverse,
}: LineupTableProps) => {
  return (
    <div
      className={`flex flex-col items-end overflow-scroll h-fit ${className}`}
    >
      <h2
        className={`w-full text-xl font-medium my-2 ${
          reverse ? 'md:text-end !w-full' : ''
        }`}
      >
        <strong>{teamName}</strong>'s lineup
      </h2>
      <CustomSeparator withText={false} />
      <div className={`flex flex-col gap-1 overflow-auto w-full h-fit`}>
        {players?.length &&
          players.map((player: any, index: number) => (
            <div
              key={index + Math.random()}
              className="flex flex-row items-center gap-2 w-max overflow-auto"
            >
              {(() => {
                let components = [
                  <Avatar
                    src={player.image_path}
                    alt={player.display_name}
                    sx={{ width: 24, height: 24 }}
                  />,
                  <p className="font-bold text-error !w-max">
                    {player.position?.developer_name
                      ? player.position?.developer_name?.slice(0, 3)
                      : '???'}
                  </p>,
                  <p className="font-semibold !w-max">{player.common_name}</p>,
                  player?._score ? (
                    <p className="font-extrabold !w-max">{player._score}</p>
                  ) : null,
                  player?._match ? (
                    <p className="font-semibold !w-max">({player._match})</p>
                  ) : null,
                ].filter(Boolean);

                return components;
              })()}
            </div>
          ))}
      </div>
    </div>
  );
};
