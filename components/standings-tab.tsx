import { useState, useEffect } from 'react';
import { ColumnsProps, CustomTable, RowsProps } from './custom/custom-table';
import { ImageUrlsProps } from '@/utils/img-urls';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { CustomImage } from './custom/custom-image';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useGetStandings } from '@/data/standings/use-get-standings';
import { useAppSelector } from '@/store/hooks';
import { getRealTeamLogoById } from '@/utils/real-team-logos';
import { EmptyMessage } from './empty-message';
import { ShortTeamPropsStandings } from '@/firebase/db-types';

type ColumnKeysProps =
  | 'INDEX'
  | 'TEAM_LOGO'
  | 'TEAM'
  | 'WINS'
  | 'DRAWS'
  | 'LOSES'
  | 'POINTS'
  | 'LAST_MATCHES';

const icons = {
  W: 'WIN_CIRCLE_ICON',
  D: 'DRAW_CIRCLE_ICON',
  L: 'LOSE_CIRCLE_ICON',
};

const getLastMatchesIcons = (lastMatches: ('W' | 'D' | 'L')[]) => {
    // LastMatches contains all the results from week 1 to x so I have to reverse it
    const lastFive = lastMatches.toReversed().slice(0,5);

  return (
    <div className="flex gap-1.5 justify-center">
      {lastFive.map((lastMatch, index) => {
        if (lastMatch) {
          const icon = icons[lastMatch] as ImageUrlsProps;
          return (
            <CustomImage key={index} imageKey={icon} width={15} height={15} />
          );
        }
      })}
    </div>
  );
};

const getTeamLogo = (teamLogoId) => {
  const teamLogo = getRealTeamLogoById(teamLogoId);
  return (
    <CustomImage
      forceSrc={teamLogo?.src}
      forcedAlt={teamLogo?.alt}
      className="h-8 w-8"
    />
  );
};

export const StandingsTab = () => {
  const user = useAppSelector((state) => state.user);
  const leagueOwner = useAppSelector((state) => state.league.owner);
  const breakpoint = useBreakpoint();
  const { pastMatchesNotCalculated } = useGetMatches();
  const { getStandingsFromActiveCompetition } = useGetStandings();
  const [standings, setStandings] = useState<ShortTeamPropsStandings[] | null>(null);

  let textForPastMatches =
    'There are matches that have not been calculated yet. ';
  textForPastMatches +=
    leagueOwner === user.id
      ? 'Go to Live Match and press Calculate Results'
      : 'Ask the Admin to confirm and save to update the standings';

  useEffect(() => {
      const _standings = getStandingsFromActiveCompetition();
        if (!_standings) return;
      setStandings(_standings);
  }, []);

  const rows: RowsProps<ColumnKeysProps> = standings && standings.length > 0 ? standings?.map((team) => {
    return {
      INDEX: team.position,
      TEAM_LOGO: getTeamLogo(team.logoId),
      TEAM: team.name,
      WINS: team.results.W,
      DRAWS: team.results.D,
      LOSES: team.results.L,
      POINTS: team.results.points,
      LAST_MATCHES: getLastMatchesIcons(team.results.lastMatches),
    };
  }) : [];

  const columns: ColumnsProps<ColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Logo', id: 'TEAM_LOGO', minWidth: 40 },
    { label: 'Team', id: 'TEAM', minWidth: 100 },
    {
      label: breakpoint === 'sm' ? 'W' : 'Wins',
      id: 'WINS',
      align: 'center',
      minWidth: 50,
    },
    {
      label: breakpoint === 'sm' ? 'D' : 'Draws',
      id: 'DRAWS',
      align: 'center',
      minWidth: 50,
    },
    {
      label: breakpoint === 'sm' ? 'L' : 'Loses',
      id: 'LOSES',
      align: 'center',
      minWidth: 50,
    },
    {
      label: breakpoint === 'sm' ? 'Pts' : 'Points',
      id: 'POINTS',
      align: 'center',
      minWidth: 50,
    },
    {
      label: 'Last Matches',
      id: 'LAST_MATCHES',
      align: 'center',
      minWidth: 150,
    },
  ];

  return standings?.length && standings.length > 0 ? (
    <div className="h-[400px] text-center">
      {pastMatchesNotCalculated() && (
        <p className="text-error-400 font-semibold mb-4">
          {textForPastMatches}
        </p>
      )}
      <CustomTable<ColumnKeysProps>
        rows={rows}
        columns={columns}
        className="bg-lightGray"
        customizeRows={{ hideHorizontalLine: true, className: 'py-2' }}
        customizeColumns={{ className: 'border-b-gray' }}
        elevation={5}
      />
    </div>
  ) : (
    <EmptyMessage
      title="No data can be calculated yet 😵"
      description="Once some matches have any results, you'll see them here!"
    />
  );
};
