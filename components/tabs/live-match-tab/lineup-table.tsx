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
}: LineupTableProps) => (
  <div className={className}>
    <h2 className={`text-xl font-medium my-2 ${reverse ? 'text-end' : ''}`}>
      <strong>{teamName}</strong>'s lineup
    </h2>
    <CustomSeparator withText={false} />
    <div className={`flex flex-col gap-1 ${reverse ? 'items-end' : ''}`}>
      {players?.length &&
        players.map((player: any, index: number) => (
          <div
            key={index + Math.random()}
            className="flex flex-row items-center gap-2"
          >
            {(() => {
              let components = [
                <Avatar
                  src={player.image_path}
                  alt={player.display_name}
                  sx={{ width: 24, height: 24 }}
                />,
                <p className="font-bold text-error">
                  {player.position?.developer_name
                    ? player.position?.developer_name?.slice(0, 3)
                    : '???'}
                </p>,
                <p className="font-semibold !w-max">{player.common_name}</p>,
              ];

              if (reverse) components.reverse();

              return components;
            })()}
          </div>
        ))}
    </div>
  </div>
);
