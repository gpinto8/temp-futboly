import { CustomImage } from '../custom/custom-image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  AllPosibleFormationsProps,
  FormationPosition,
} from '@/utils/formations';
import { CircleFieldMatchingFormation } from './circle-field-matching-formation';
import { TeamPlayersData, YourTeamKeyProps } from '../tabs/teams-tab/your-team';
import { RowsProps } from '../custom/custom-table';
import { SelectableTableColumnKeysProps } from '../table/selectable-table';

export type FootballFieldProps = {
  formation?: AllPosibleFormationsProps;
  fieldPlayers?: TeamPlayersData;
  setFieldPlayers?: Dispatch<SetStateAction<TeamPlayersData>>;
  getSelectedPlayerPosition?: (position: FormationPosition) => void;
  emptyFormationMessage: string;
  resetField?: number; // Reset it with "Math.random()" to trigger the useEffect hook
  selectedPlayer?: RowsProps<
    SelectableTableColumnKeysProps<YourTeamKeyProps>
  >[0];
  setSelectedPlayer?: Dispatch<SetStateAction<number>>;
};

export const FootballField = ({
  formation,
  fieldPlayers,
  setFieldPlayers,
  getSelectedPlayerPosition,
  emptyFormationMessage,
  resetField,
  selectedPlayer,
  setSelectedPlayer,
}: FootballFieldProps) => {
  const [selectedPlayerPosition, setSelectedPlayerPosition] = useState<
    FormationPosition | ''
  >('');

  useEffect(() => {
    if (selectedPlayerPosition) {
      getSelectedPlayerPosition?.(selectedPlayerPosition);
    }
  }, [selectedPlayerPosition, getSelectedPlayerPosition]);

  useEffect(() => {
    setSelectedPlayerPosition('');
  }, [resetField]);

  const handleCircleField = (currentPosition: FormationPosition) => {
    const selected: FormationPosition | '' =
      currentPosition !== selectedPlayerPosition ? currentPosition : '';
    setSelectedPlayerPosition(selected);
  };

  return (
    <div className="relative w-full overflow-auto">
      <div className="absolute w-full h-full flex flex-col justify-between gap-2">
        {formation && fieldPlayers?.length ? (
          <CircleFieldMatchingFormation
            formation={formation}
            players={fieldPlayers}
            setPlayers={setFieldPlayers!}
            circleFieldProps={{
              handleClick: handleCircleField,
              selectedPlayerPosition,
            }}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        ) : (
          <div className="font-bold m-auto pb-14">{emptyFormationMessage}</div>
        )}
      </div>
      <CustomImage imageKey="FOOTBALL_FIELD" className="w-full h-auto" />
    </div>
  );
};
