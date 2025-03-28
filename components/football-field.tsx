import { Avatar } from '@mui/material';
import { CustomImage } from './custom/custom-image';
import { useEffect, useState } from 'react';
import {
  AllPosibleFormationsProps,
  mapFormationPosition,
} from '@/utils/formations';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { fetchSportmonksApi } from '@/sportmonks/fetch-sportmonks-api';

type CircleFieldProps = {
  player?: CompetitionsCollectionTeamsProps['players'][0];
  handleClick?: () => void;
  currentPosition?: string;
  selectedPlayerPosition: string;
};

const CircleField = ({
  player,
  handleClick,
  currentPosition,
  selectedPlayerPosition,
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
      className={`gap-2 !bg-white hover:bg-lightGray w-20 h-20  cursor-pointer text-center text-black rounded-full border-black border-2 ${
        isSelected ? '!border-success-400 border-[6px]' : ''
      }`}
    >
      <div className="w-full flex flex-col items-center justify-center h-full overflow-hidden">
        {data?.src ? (
          <Avatar
            src={data?.src}
            alt={data?.name}
            sx={{ width: 24, height: 24 }}
          />
        ) : null}
        <div className="text-xs w-max">{data?.name}</div>
        <div className="text-[10px] w-max text-gray-600">{data?.position}</div>
      </div>
    </div>
  );
};

export type FootballFieldProps = {
  formation?: AllPosibleFormationsProps;
  fieldPlayers?: CompetitionsCollectionTeamsProps['players'];
  getSelectedPlayerPosition?: (position: string) => void;
  emptyFormationMessage: string;
  resetField?: number; // Reset it with "Math.random()" to trigger the useEffect hook
};

export const FootballField = ({
  formation,
  fieldPlayers,
  getSelectedPlayerPosition,
  emptyFormationMessage,
  resetField,
}: FootballFieldProps) => {
  const [selectedPlayerPosition, setSelectedPlayerPosition] = useState('');

  useEffect(() => {
    getSelectedPlayerPosition?.(selectedPlayerPosition);
  }, [selectedPlayerPosition, getSelectedPlayerPosition]);

  useEffect(() => {
    setSelectedPlayerPosition('');
  }, [resetField]);

  const handleCircleField = (currentPosition: string) => {
    const selected =
      currentPosition !== selectedPlayerPosition ? currentPosition : '';
    setSelectedPlayerPosition(selected);
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <div className="absolute w-full h-full flex flex-col justify-between gap-4 p-4 py-2">
        {formation ? (
          <>
            {formation
              .split('')
              ?.reverse()
              ?.map((formationTotalPlayers, playerPosition) => {
                return (
                  <div
                    key={playerPosition}
                    className="h-full flex gap-4 justify-evenly items-center"
                  >
                    {new Array(+formationTotalPlayers)
                      .fill(undefined)
                      .map((_, fieldRow) => {
                        const currentPosition = mapFormationPosition(
                          formationTotalPlayers,
                          playerPosition,
                          fieldRow,
                        );

                        const fieldPlayer:
                          | CompetitionsCollectionTeamsProps['players'][0]
                          | undefined = fieldPlayers?.find(
                          (player) => player?.position === currentPosition,
                        );

                        return (
                          <CircleField
                            key={fieldRow}
                            player={fieldPlayer}
                            handleClick={() =>
                              handleCircleField(currentPosition)
                            }
                            currentPosition={currentPosition}
                            selectedPlayerPosition={selectedPlayerPosition}
                          />
                        );
                      })}
                  </div>
                );
              })}
            <div className="flex justify-center">
              <CircleField
                // data={{ src: '', name: 'Goalkeeper', position: 'Goalkeeper' }}
                selectedPlayerPosition={selectedPlayerPosition}
              />
            </div>
          </>
        ) : (
          <div className="font-bold m-auto pb-14">{emptyFormationMessage}</div>
        )}
      </div>
      <CustomImage imageKey="FOOTBALL_FIELD" className="w-full h-auto" />
    </div>
  );
};
