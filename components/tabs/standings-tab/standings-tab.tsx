import { useState, useEffect } from 'react';
import { ColumnsProps, CustomTable, RowsProps } from '../../custom/custom-table';
import { ImageUrlsProps } from '@/utils/img-urls';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { CustomImage } from '../../custom/custom-image';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useGetStandings } from '@/data/standings/use-get-standings';
import { useAppSelector } from '@/store/hooks';
import { getRealTeamLogoById } from '@/utils/real-team-logos';
import { EmptyMessage } from '../../empty-message';

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
  lastMatches.length = 5; // Limit the UI to just show 5

  return (
    <div className="flex gap-1.5 justify-center">
      {lastMatches.map((lastMatch, index) => {
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
  const { getActiveCompetitionStandings } = useGetStandings();
  const [standings, setStandings] = useState<any>(null);

  let textForPastMatches =
    'There are matches that have not been calculated yet. ';
  textForPastMatches +=
    leagueOwner === user.id
      ? 'Go to Live Match and press Calculate Results'
      : 'Ask the Admin to confirm and save to update the standings';

  useEffect(() => {
    (async () => {
      const _standings = await getActiveCompetitionStandings();
      setStandings(_standings);
    })();
  }, []);

  const rows: RowsProps<ColumnKeysProps> = standings?.map((team, index) => {
    return {
      INDEX: index + 1,
      TEAM_LOGO: getTeamLogo(team.logoId),
      TEAM: team.name,
      WINS: team.results.W,
      DRAWS: team.results.D,
      LOSES: team.results.L,
      POINTS: team.results.points,
      LAST_MATCHES: getLastMatchesIcons(team.results.lastMatches),
    };
  });

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

  return standings?.length ? (
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
