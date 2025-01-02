import { useState, useEffect } from 'react';
import { CustomImage } from '@/components/custom/custom-image';
import {
  ColumnsProps,
  RowsProps,
  CustomTable,
} from '@/components/custom/custom-table';
import { LeaguesCollectionProps } from '@/firebase/db-types';
import { PageLoader } from '@/components/page-loader';
import { JoinPublicLeagueModal } from '@/components/modal/leagues-modal';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { QueryDocumentSnapshot } from 'firebase/firestore';

type LeaguesColumnKeysProps =
  | 'PRIVATE'
  | 'NAME'
  | 'WEEK'
  | 'PLAYERS'
  | 'ACTIONS';

const columns: ColumnsProps<LeaguesColumnKeysProps> = [
  { id: 'PRIVATE', label: ' ', minWidth: 50, align: 'center' },
  { id: 'NAME', label: 'Name', minWidth: 150 },
  { id: 'WEEK', label: 'Week', minWidth: 75 },
  { id: 'PLAYERS', label: 'Players', minWidth: 75 },
  { id: 'ACTIONS', label: ' ', minWidth: 75, align: 'center' },
];

const getRows = (leagues: Array<LeaguesCollectionProps>) => {
  return leagues.map((league: LeaguesCollectionProps) => {
    const players = league.players?.length || 0;
    return {
      PRIVATE: (
        <CustomImage
          imageKey={league.isPrivate ? 'PRIVATE' : 'PUBLIC'}
          width={20}
          height={20}
        />
      ),
      NAME: league.name,
      WEEK: 'Week 1',
      PLAYERS: players + ' / 10',
      ACTIONS: (
        <JoinPublicLeagueModal league={league as LeaguesCollectionProps} />
      ),
    };
  });
};

export const LeagueList = () => {
  const { getAllLeaguesByChunks } = useGetLeagues();
  const [itemCounter, setItemCounter] = useState(0);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [rows, setRows] = useState<
    RowsProps<LeaguesColumnKeysProps> | never[]
  >();

  useEffect(() => {
    const fetchData = async () => {
      if (!hasMore) return;
      const data = await getAllLeaguesByChunks(
        itemCounter === 0 ? undefined : lastVisible,
        5,
      );
      if (!data) return;
      if (rows && rows?.length > 0 && Array.isArray(rows)) {
        setRows([
          ...rows,
          ...getRows(data.leagues as LeaguesCollectionProps[]),
        ]);
      } else {
        setRows(getRows(data.leagues as LeaguesCollectionProps[]));
      }
      setHasMore(data.hasMore);
      setLastVisible(data.lastVisible as QueryDocumentSnapshot);
    };

    fetchData();

    return () => {
      //console.log('Component unmounted');
    };
  }, [itemCounter]);

  return (
    <div>
      {!rows && <PageLoader />}
      {rows && rows.length > 0 ? (
        <div className="mt-4 rounded-xl">
          <CustomTable
            columns={columns}
            rows={rows}
            elevation={1}
            className="deep-faded-shadow-around rounded-l min-h-[45vh]"
            onEndReached={() => {
              hasMore
                ? setItemCounter(itemCounter + 1)
                : null; /*We could handle better for example showing "no more leagues"*/
            }}
            isComplete={{ value: !hasMore, text: 'No more leagues' }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <p className="text-lg font-semibold text-gray-500">
            No leagues found
          </p>
        </div>
      )}
    </div>
  );
};
