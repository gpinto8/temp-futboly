import { ColumnsProps, CustomTable, RowsProps } from './custom/custom-table';
import { IMG_URLS } from '@/utils/img-urls';
import { useBreakpoint } from '@/utils/use-breakpoint';
import Image from 'next/image';

type ColumnKeysProps = 'INDEX' | 'TEAM' | 'WINS' | 'DRAWS' | 'LOSES' | 'POINTS' | 'LAST_MATCHES';

const getLastMatchesIcons = (lastMatches: ('W' | 'D' | 'L')[]) => {
  lastMatches.length = 5; // Limit the UI to just show 5

  return (
    <div className="flex gap-1.5 justify-center">
      {lastMatches.map((lastMatch, index) => {
        const icons = {
          W: 'WIN_CIRCLE_ICON',
          D: 'DRAW_CIRCLE_ICON',
          L: 'LOSE_CIRCLE_ICON',
        };
        if (lastMatch) {
          const icon = IMG_URLS[icons[lastMatch] as keyof typeof IMG_URLS];
          return (
            <Image key={lastMatch + index} src={icon.src} width={15} height={15} alt={icon.alt} />
          );
        }
      })}
    </div>
  );
};

export const StandingsTab = () => {
  const breakpoint = useBreakpoint();

  const rows: RowsProps<ColumnKeysProps> = [
    {
      INDEX: 1,
      TEAM: 'Team1',
      WINS: 12,
      DRAWS: 12,
      LOSES: 12,
      POINTS: 35,
      LAST_MATCHES: getLastMatchesIcons(['W', 'L', 'W', 'D', 'W', 'L']),
    },
    { INDEX: 1, TEAM: 'Team1', WINS: 12, DRAWS: 12, LOSES: 12, POINTS: 35, LAST_MATCHES: '' },
    { INDEX: 1, TEAM: 'Team1', WINS: 12, DRAWS: 12, LOSES: 12, POINTS: 35, LAST_MATCHES: '' },
    { INDEX: 1, TEAM: 'Team1', WINS: 12, DRAWS: 12, LOSES: 12, POINTS: 35, LAST_MATCHES: '' },
  ];

  const columns: ColumnsProps<ColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Team', id: 'TEAM', minWidth: 100 },
    { label: breakpoint === 'sm' ? 'W' : 'Wins', id: 'WINS', align: 'center', minWidth: 50 },
    { label: breakpoint === 'sm' ? 'D' : 'Draws', id: 'DRAWS', align: 'center', minWidth: 50 },
    { label: breakpoint === 'sm' ? 'L' : 'Loses', id: 'LOSES', align: 'center', minWidth: 50 },
    { label: breakpoint === 'sm' ? 'Pts' : 'Points', id: 'POINTS', align: 'center', minWidth: 50 },
    { label: 'Last Matches', id: 'LAST_MATCHES', align: 'center', minWidth: 150 },
  ];

  return (
    <div className="h-[400px]">
      <CustomTable<ColumnKeysProps>
        rows={rows}
        columns={columns}
        className="bg-lightGray"
        customizeRows={{ hideHorizontalLine: true, className: 'py-2' }}
        customizeColumns={{ className: 'border-b-gray' }}
        elevation={5}
      />
    </div>
  );
};
