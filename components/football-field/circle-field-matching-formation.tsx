import {
  CompetitionsCollectionTeamsProps,
  TEAMS_GOALKEEPER_FORMATION_POSITION,
} from '@/firebase/db-types';
import {
  AllPosibleFormationsProps,
  mapFormationPosition,
} from '@/utils/formations';
import { CircleField } from './circle-field';

type CircleFieldMatchingFormationProps = {
  formation: AllPosibleFormationsProps;
  players: CompetitionsCollectionTeamsProps['players'];
  orientation: 'right-to-left' | 'left-to-right';
};

export const CircleFieldMatchingFormation = ({
  formation,
  players,
  orientation,
}: CircleFieldMatchingFormationProps) => {
  const goalkeeper = players?.find(
    (player) => player?.position === TEAMS_GOALKEEPER_FORMATION_POSITION,
  );

  const isLeftToRight = orientation === 'left-to-right';

  const formationArray = () => {
    let splitted = formation?.split('');

    if (isLeftToRight) return splitted;
    else return splitted.reverse();
  };

  return (
    <div className="w-full flex">
      {isLeftToRight && (
        <div className="flex h-full items-center">
          <CircleField
            player={goalkeeper}
            currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
          />
        </div>
      )}
      {formationArray().map((formationTotalPlayers, fieldRow) => {
        return (
          <div
            key={fieldRow}
            className="w-full flex gap-4 justify-evenly items-center flex-col"
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
                  playerPosition,
                  newFieldRow,
                );

                const fieldPlayer:
                  | CompetitionsCollectionTeamsProps['players'][0]
                  | undefined = players?.find(
                  (player) => player?.position === currentPosition,
                );

                return (
                  <CircleField
                    key={playerPosition}
                    player={fieldPlayer}
                    currentPosition={currentPosition}
                  />
                );
              })}
          </div>
        );
      })}
      {!isLeftToRight && (
        <div className="flex h-full items-center">
          <CircleField
            player={goalkeeper}
            currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
          />
        </div>
      )}
    </div>
  );
};
