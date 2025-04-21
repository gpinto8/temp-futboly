import { CustomImage } from '@/components/custom/custom-image';
import { LiveMatchProps } from '@/data/matches/use-get-matches';
import { useGetStandings } from '@/data/standings/use-get-standings';
import { getRealTeamLogoById } from '@/utils/real-team-logos';
import { FootballFieldHorizontal } from '@/components/football-field/football-field-horizontal';
import { useGetUsers } from '@/data/users/use-get-users';
import { LineUpTable } from './lineup-table';
import {
  AllPosibleFormationsProps,
  FormationPosition,
} from '@/utils/formations';
import { TeamPlayersData } from '../teams-tab/your-team';

type LiveMatchSectionProps = { nextMatch: LiveMatchProps };

export const LiveMatchSection = ({ nextMatch }: LiveMatchSectionProps) => {
  const { getUser } = useGetUsers();
  const { getTeamPositionFromActiveCompetition } = useGetStandings();

  const { home, away, week, result } = nextMatch;
  const homeTeamLogo = getRealTeamLogoById(home.logoId);
  const awayTeamLogo = getRealTeamLogoById(away.logoId);

  const homeClass =
    nextMatch?.home?.userRef?.id === getUser().id ? 'text-main' : '';
  const awayClass =
    nextMatch?.away?.userRef?.id === getUser().id ? 'text-main' : '';

  const footballFieldData: {
    [key: string]: {
      formation?: AllPosibleFormationsProps;
      players: TeamPlayersData;
    };
  } = {
    home: {
      formation: home.formation,
      players: home.players.map((player) => ({
        ...player,
        apiData: home.playersAPI.find(
          (item: any) => player.sportmonksId === item?.id,
        ),
      })),
    },
    away: {
      formation: away.formation,
      players: away.players.map((player) => ({
        ...player,
        apiData: away.playersAPI.find(
          (item: any) => player.sportmonksId === item?.id,
        ),
      })),
    },
  };

  return (
    <div className="flex flex-col w-full items-center justify-between gap-8 mt-4">
      <div className="w-full flex flex-row items-center justify-center gap-8">
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
              <p className="font-medium text-md text-gray-600">
                {getPositionTextFromPosition(
                  getTeamPositionFromActiveCompetition(home.shortId),
                )}
              </p>
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
              <p className="font-medium text-md text-gray-600">
                {getPositionTextFromPosition(
                  getTeamPositionFromActiveCompetition(away.shortId),
                )}
              </p>
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
          homeData={footballFieldData.home}
          awayData={footballFieldData.away}
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

function getPositionTextFromPosition(position: number | undefined): string {
  if (!position) return '';
  return `${position.toString()}${getOrdinalSuffix(position)} Position`;
}

function getOrdinalSuffix(position: number): string {
  const lastDigit = position % 10;
  const lastTwoDigits = position % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
