import { TEAMS_GOALKEEPER_FORMATION_POSITION } from '@/firebase/db-types';
import {
  AllPosibleFormationsProps,
  FormationPosition,
  mapFormationPosition,
} from '@/utils/formations';
import { CircleField, CircleFieldProps } from './circle-field';
import { TeamPlayersData } from '../tabs/teams-tab/your-team';

type MappedCircleFieldProps = {
  player: TeamPlayersData[0];
  currentPosition: FormationPosition;
  circleFieldProps: CircleFieldMatchingFormationProps['circleFieldProps'];
};

const MappedCircleField = ({
  player,
  currentPosition,
  circleFieldProps,
}: MappedCircleFieldProps) => {
  const isSelected =
    circleFieldProps?.selectedPlayerPosition === currentPosition;

  return (
    <CircleField
      player={player}
      handleClick={() => circleFieldProps?.handleClick?.(currentPosition)}
      isSelected={isSelected}
    />
  );
};
type CircleFieldMatchingFormationProps = {
  formation: AllPosibleFormationsProps;
  players: TeamPlayersData;
  orientation?: 'bottom-to-top' | 'right-to-left' | 'left-to-right';
  circleFieldProps?: {
    handleClick?: (position?: FormationPosition) => void;
    selectedPlayerPosition?: CircleFieldProps['selectedPlayerPosition'];
  };
};

export const CircleFieldMatchingFormation = ({
  formation,
  players,
  orientation = 'bottom-to-top', // This is the default
  circleFieldProps,
}: CircleFieldMatchingFormationProps) => {
  const goalkeeper = players?.find(
    (player) => player?.position === TEAMS_GOALKEEPER_FORMATION_POSITION,
  ) as TeamPlayersData[0];
  const isLeftToRight = orientation === 'left-to-right';

  let mainClassName: string;
  let goalkeeperClassName: string;
  let rowsClassName: string;
  let formationArray: string[] = [];

  switch (orientation) {
    case 'bottom-to-top':
      mainClassName = 'w-full flex flex-col justify-between h-full';
      goalkeeperClassName = 'flex justify-center';
      rowsClassName = 'h-full';
      formationArray = formation?.split('')?.reverse();
      break;

    case 'left-to-right':
      mainClassName = 'w-full flex';
      goalkeeperClassName = 'flex h-full items-center';
      rowsClassName = 'w-full flex-col';
      formationArray = formation?.split('');
      break;

    case 'right-to-left':
      mainClassName = 'w-full flex';
      goalkeeperClassName = 'flex h-full items-center';
      rowsClassName = 'w-full flex-col';
      formationArray = formation?.split('')?.reverse();
      break;
  }

  return (
    <div className={mainClassName}>
      {isLeftToRight && (
        <div className={goalkeeperClassName}>
          <MappedCircleField
            player={goalkeeper}
            currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
            circleFieldProps={circleFieldProps}
          />
        </div>
      )}
      {formationArray.map((formationTotalPlayers, fieldRow) => {
        return (
          <div
            key={fieldRow}
            className={`flex gap-4 justify-evenly items-center ${rowsClassName}`}
          >
            {new Array(+formationTotalPlayers)
              .fill(undefined)
              .map((_, playerPosition) => {
                let newFieldRow = fieldRow;

                if (isLeftToRight) {
                  const formationDigits = formation?.split('+')?.[0]?.length;
                  const reverseFieldRow = formationDigits
                    ? formationDigits - fieldRow - 1
                    : fieldRow;

                  newFieldRow = reverseFieldRow;
                }

                const currentPosition = mapFormationPosition(
                  formationTotalPlayers,
                  playerPosition + 1,
                  newFieldRow + 1,
                );

                const fieldPlayer = players?.find(
                  (player) => player?.position === currentPosition,
                ) as TeamPlayersData[0];

                return (
                  <MappedCircleField
                    key={playerPosition}
                    player={fieldPlayer}
                    currentPosition={currentPosition}
                    circleFieldProps={circleFieldProps}
                  />
                );
              })}
          </div>
        );
      })}
      {!isLeftToRight && (
        <div className={goalkeeperClassName}>
          <MappedCircleField
            player={goalkeeper}
            currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
            circleFieldProps={circleFieldProps}
          />
        </div>
      )}
    </div>
  );
};
