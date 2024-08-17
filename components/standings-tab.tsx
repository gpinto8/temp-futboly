import { useState } from 'react';
import { ColumnsProps, CustomTable, RowsProps } from './custom/custom-table';
import { IMG_URLS } from '@/utils/img-urls';
import Image from 'next/image';

type ColumnKeysProps = 'INDEX' | 'TEAM' | 'WINS' | 'DRAWS' | 'LOSES' | 'POINTS' | 'LAST_MATCHES';

const getLastMatchesIcons = (lastMatches: ('W' | 'D' | 'L')[]) => {
  lastMatches.length = 5; // Limit the UI to just show 5

  return (
    <div className="flex gap-1.5 justify-center">
      {lastMatches.map(lastMatch => {
        const icons = {
          W: 'WIN_CIRCLE_ICON',
          D: 'DRAW_CIRCLE_ICON',
          L: 'LOSE_CIRCLE_ICON',
        };
        if (lastMatch) {
          const icon = IMG_URLS[icons[lastMatch] as keyof typeof IMG_URLS];
          return <Image src={icon.src} width={15} height={15} alt={icon.alt} />;
        }
      })}
    </div>
  );
};

export const StandingsTab = () => {
  useState();

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
    { label: '#', id: 'INDEX' },
    { label: 'Team', id: 'TEAM' },
    { label: 'W', id: 'WINS', centered: true },
    { label: 'D', id: 'DRAWS', centered: true },
    { label: 'L', id: 'LOSES', centered: true },
    { label: 'Points', id: 'POINTS', centered: true },
    { label: 'Last Matches', id: 'LAST_MATCHES', centered: true },
  ];

  return (
    <div className="h-[400px]">
      <CustomTable<ColumnKeysProps>
        rows={rows}
        columns={columns}
        className="bg-lightGray"
        customizeRows={{ hideHorizontalLine: true, className: 'py-2' }}
        customizeColumns={{ className: 'border-b-gray' }}
      />
    </div>
  );
};
