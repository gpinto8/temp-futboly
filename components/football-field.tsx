import { Avatar } from '@mui/material';
import { CustomImage } from './custom/custom-image';
import { useState } from 'react';

export type FootballFieldProps = {
  formation?: string;
  handlePlayerSelected?: (position: number) => void;
  emptyFormationMessage: string;
};

type FootballFieldPlayerData = {
  src: string;
  name: string;
  position: string;
};

type CircleFieldProps = {
  data: FootballFieldPlayerData;
  handleClick?: () => void;
  currentPosition?: string;
  selectedPlayerPosition: string;
};
const CircleField = ({
  data,
  handleClick,
  currentPosition,
  selectedPlayerPosition,
}: CircleFieldProps) => {
  const isSelected = currentPosition === selectedPlayerPosition;

  return (
    <div
      onClick={handleClick}
      className={`gap-2 !bg-white hover:bg-lightGray w-20 h-20  cursor-pointer text-center text-black rounded-full border-black border-2 ${
        isSelected ? '!border-success-500 border-[6px]' : ''
      }`}
    >
      <div className="w-full flex flex-col items-center justify-center h-full overflow-hidden">
        <Avatar src={data.src} alt={data.name} sx={{ width: 24, height: 24 }} />
        <div className="text-xs w-max">{data.name}</div>
        <div className="text-[10px] w-max text-gray-600">{data.position}</div>
      </div>
    </div>
  );
};

export const FootballField = ({
  formation,
  handlePlayerSelected,
  emptyFormationMessage,
}: FootballFieldProps) => {
  const [selectedPlayerPosition, setSelectedPlayerPosition] = useState('');

  const calculateCurrentPosition = (
    formationTotalPlayers: string, // e.g "4" ("432")
    playerPosition: number, // e.g the first one of the "4" players, from left to right ("432")
    fieldRow: number, // e.g the first row of the 3 to display, from top to bottom ("432")
  ) => `${formationTotalPlayers}+${playerPosition + 1}+${fieldRow + 1}`;

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
                  <div className="h-full flex gap-4 justify-evenly items-center">
                    {new Array(+formationTotalPlayers)
                      .fill(undefined)
                      .map((_, fieldRow) => {
                        const currentPosition = calculateCurrentPosition(
                          formationTotalPlayers,
                          playerPosition,
                          fieldRow,
                        );

                        return (
                          <CircleField
                            data={{
                              src: '',
                              name: 'El nombre',
                              position: 'La posicion',
                            }}
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
                data={{ src: '', name: 'Goalkeeper', position: 'Goalkeeper' }}
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
