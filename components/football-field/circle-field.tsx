import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { fetchSportmonksApi } from '@/sportmonks/fetch-sportmonks-api';
import { FormationPosition } from '@/utils/formations';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

export type CircleFieldProps = {
  selectedPlayerPosition?: string;
  player?: CompetitionsCollectionTeamsProps['players'][0];
  handleClick?: () => void;
  currentPosition?: FormationPosition;
};

export const CircleField = ({
  selectedPlayerPosition,
  player,
  handleClick,
  currentPosition,
}: CircleFieldProps) => {
  const [data, setData] = useState<{
    src: string;
    name: string;
    position: string;
  }>({ name: '', position: '', src: '' });

  const isSelected = currentPosition === selectedPlayerPosition;

  useEffect(() => {
    (async () => {
      const playerId = player?.sportmonksId;
      if (playerId) {
        const response = await fetchSportmonksApi(
          'football/players',
          `${playerId}`,
        );

        const data = response.data;
        setData({
          src: data?.image_path,
          name: data?.display_name,
          position: data?.position?.name,
        });
      } else {
        setData({ src: '', name: '', position: '' });
      }
    })();
  }, [player]);

  return (
    <div
      onClick={handleClick}
      className={`gap-2 !bg-white hover:bg-lightGray w-12 h-12 sm:w-20 sm:h-20 md:w-20 md:h-20  cursor-pointer text-center text-black rounded-full border-black border-2 ${
        isSelected ? '!border-success-400 border-[6px]' : ''
      }`}
    >
      <div className="w-full flex flex-col items-center justify-center h-full overflow-hidden">
        {data?.src ? (
          <Avatar
            src={data?.src}
            alt={data?.name}
            className="h-4 w-4 sm:h-6 sm:w-6 md:h-6 md:w-6"
          />
        ) : null}
        <div className="text-xs w-max">{data?.name}</div>
        <div className="text-[10px] w-max text-gray-600">{data?.position}</div>
      </div>
    </div>
  );
};
