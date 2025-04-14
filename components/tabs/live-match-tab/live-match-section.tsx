import { CustomImage } from '@/components/custom/custom-image';
import { Avatar } from '@mui/material';
import { CustomSeparator } from '@/components/custom/custom-separator';
import { LiveMatchProps } from '@/data/matches/use-get-matches';
import { getRealTeamLogoById } from '@/utils/real-team-logos';
import { FootballFieldHorizontal } from '@/components/football-field/football-field-horizontal';
import { useGetUsers } from '@/data/users/use-get-users';

type LineupTableProps = {
  className: string;
  teamName: string;
  players: any;
  reverse?: boolean;
};

const LineUpTable = ({
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
          <div key={index} className="flex flex-row items-center gap-2">
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

export const LiveMatchSection = ({
  nextMatch,
}: {
  nextMatch: LiveMatchProps;
}) => {
  const { getUser } = useGetUsers();

  const { home, away, week, result } = nextMatch;
  const homeTeamLogo = getRealTeamLogoById(home.logoId);
  const awayTeamLogo = getRealTeamLogoById(away.logoId);

  const homeClass =
    nextMatch.home.userRef.id === getUser().id ? 'text-main' : '';
  const awayClass =
    nextMatch.away.userRef.id === getUser().id ? 'text-main' : '';

  return (
    <div className="flex flex-col w-full items-center justify-between gap-8 mt-8">
      <div className="w-full flex flex-row items-center justify-center gap-8 mt-8">
        <div className="flex justify-around items-center my-4 gap-10">
          {/* HOME RESULT */}
          <div className="flex flex-row gap-4 items-center">
            <CustomImage
              forceSrc={homeTeamLogo?.src}
              forcedAlt={homeTeamLogo?.alt}
              className="h-12 w-12"
            />
            <div>
              <p className={homeClass + ' font-bold text-l text-left'}>
                {home.name}
              </p>
              <p className="font-medium text-md text-gray-600">Posizione</p>
            </div>
          </div>

          {/* RESULT */}
          <div className="flex flex-col justify-center items-center">
            {result && (
              <div className="flex flex-row gap-2 justify-center items-center">
                <p className="font-bold text-error-400">{result.home}</p> vs{' '}
                <p className="font-bold text-main-400">{result.away}</p>
              </div>
            )}
            <p className="font-semibold text-gray-600">Week {week}</p>
          </div>

          {/* AWAY RESULT */}
          <div className="flex flex-row gap-4 items-center">
            <div>
              <p className={awayClass + ' font-bold text-l text-right'}>
                {away.name}
              </p>
              <p className="font-medium text-md text-gray-600">Posizione</p>
            </div>
            <CustomImage
              forceSrc={awayTeamLogo?.src}
              forcedAlt={awayTeamLogo?.alt}
              className="h-12 w-12"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex gap-4 flex-col lg:flex-row justify-between">
        {/* MOBILE LINEUPS VERSION */}
        <div className="flex w-full gap-8 lg:hidden justify-between">
          <LineUpTable
            className="w-full"
            teamName={home.name}
            players={home.playersAPI}
          />
          <LineUpTable
            className="w-full"
            teamName={away.name}
            players={away.playersAPI}
            reverse
          />
        </div>

        {/* HOME LINEUP */}
        <LineUpTable
          className="hidden lg:block w-[20%]"
          teamName={home.name}
          players={home.playersAPI}
        />

        {/* FOOTBALL FIELD */}
        <FootballFieldHorizontal
          homeData={{ formation: home.formation, players: home.players }}
          awayData={{ formation: away.formation, players: away.players }}
        />

        {/* AWAY LINEUP */}
        <LineUpTable
          className="hidden lg:block w-[20%]"
          teamName={away.name}
          players={away.playersAPI}
          reverse
        />
      </div>
    </div>
  );
};
