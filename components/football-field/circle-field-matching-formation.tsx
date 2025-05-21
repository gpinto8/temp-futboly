import { TEAMS_GOALKEEPER_FORMATION_POSITION } from '@/firebase/db-types';
import {
  AllPosibleFormationsProps,
  FormationPosition,
  mapFormationPosition,
} from '@/utils/formations';
import { CircleField, CircleFieldProps } from './circle-field';
import {
  TEAM_ATTACKER_NAME,
  TEAM_DEFENDER_NAME,
  TEAM_GOALKEEPER_NAME,
  TEAM_MIDFIELDER_NAME,
  TeamPlayersData,
  YourTeamKeyProps,
} from '../tabs/teams-tab/your-team';
import { RowsProps } from '../custom/custom-table';
import { SelectableTableColumnKeysProps } from '../table/selectable-table';

type MappedCircleFieldProps = {
  player: TeamPlayersData[0];
  currentPosition: FormationPosition;
  circleFieldProps: CircleFieldMatchingFormationProps['circleFieldProps'];
  avoidResponsiveClasses: CircleFieldProps['avoidResponsiveClasses'];
  selectedPlayer?: RowsProps<
    SelectableTableColumnKeysProps<YourTeamKeyProps>
  >[0];
};

const MappedCircleField = ({
  player,
  currentPosition,
  circleFieldProps,
  avoidResponsiveClasses,
  selectedPlayer,
}: MappedCircleFieldProps) => {
  const isSelected =
    circleFieldProps?.selectedPlayerPosition === currentPosition;

  let isAble: boolean;

  const alreadyInField = player?.position;
  if (alreadyInField) isAble = true;
  else {
    const selectedPlayerPosition = selectedPlayer?.POSITION;
    const selectedCurrentPosition = currentPosition.slice(-1);

    const isGoalkeeper =
      selectedPlayerPosition === TEAM_GOALKEEPER_NAME &&
      currentPosition === '1';
    const isAttacker =
      selectedPlayerPosition === TEAM_ATTACKER_NAME &&
      currentPosition !== '1' && // Because the {TEAM_ATTACKER_NAME} and the {TEAM_GOALKEEPER_NAME} have the same row position number ("1")
      selectedCurrentPosition === '1';
    const isMidfielder =
      selectedPlayerPosition === TEAM_MIDFIELDER_NAME &&
      selectedCurrentPosition === '2';
    const isDefender =
      selectedPlayerPosition === TEAM_DEFENDER_NAME &&
      selectedCurrentPosition === '3';

    isAble = isGoalkeeper || isAttacker || isMidfielder || isDefender;
  }

  return (
    <CircleField
      player={player}
      handleClick={() => circleFieldProps?.handleClick?.(currentPosition)}
      isSelected={isSelected}
      avoidResponsiveClasses={avoidResponsiveClasses}
      isAble={isAble}
    />
  );
};
type CircleFieldMatchingFormationProps = {
  formation: AllPosibleFormationsProps;
  players: TeamPlayersData;
  orientation?:
    | 'bottom-to-top'
    | 'right-to-left'
    | 'top-to-bottom'
    | 'left-to-right';
  circleFieldProps?: {
    handleClick?: (position?: FormationPosition) => void;
    selectedPlayerPosition?: CircleFieldProps['selectedPlayerPosition'];
  };
  avoidResponsiveClasses?: CircleFieldProps['avoidResponsiveClasses'];
  selectedPlayer?: RowsProps<
    SelectableTableColumnKeysProps<YourTeamKeyProps>
  >[0];
};

export const CircleFieldMatchingFormation = ({
  formation,
  players,
  orientation = 'bottom-to-top', // This is the default
  circleFieldProps,
  avoidResponsiveClasses,
  selectedPlayer,
}: CircleFieldMatchingFormationProps) => {
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

    case 'right-to-left':
      mainClassName = 'w-full flex';
      goalkeeperClassName = 'flex h-full items-center';
      rowsClassName = 'w-full flex-col';
      formationArray = formation?.split('')?.reverse();
      break;

    case 'top-to-bottom':
      mainClassName = 'w-full flex flex-col justify-between h-full';
      goalkeeperClassName = 'flex justify-center';
      rowsClassName = 'h-full';
      formationArray = formation?.split('');
      break;

    case 'left-to-right':
      mainClassName = 'w-full flex';
      goalkeeperClassName = 'flex h-full items-center';
      rowsClassName = 'w-full flex-col';
      formationArray = formation?.split('');
      break;
  }

  const goalkeeper = players?.find(
    (player) => player?.position === TEAMS_GOALKEEPER_FORMATION_POSITION,
  ) as TeamPlayersData[0];

  const upsideDown =
    orientation === 'left-to-right' || orientation === 'top-to-bottom'; // This is done so the goalkeeper is placed correctly and also the formation based on these orientations

  return (
    <div className={mainClassName}>
      {upsideDown && (
        <div className={goalkeeperClassName}>
          <MappedCircleField
            player={goalkeeper}
            currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
            circleFieldProps={circleFieldProps}
            avoidResponsiveClasses={avoidResponsiveClasses}
            selectedPlayer={selectedPlayer}
          />
        </div>
      )}
      {formationArray?.map((formationTotalPlayers, fieldRow) => {
        return (
          <div
            key={fieldRow}
            className={`flex gap-4 justify-evenly items-center ${rowsClassName}`}
          >
            {new Array(+formationTotalPlayers)
              .fill(undefined)
              .map((_, playerPosition) => {
                let newFieldRow = fieldRow;

                if (upsideDown) {
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
                    avoidResponsiveClasses={avoidResponsiveClasses}
                    selectedPlayer={selectedPlayer}
                  />
                );
              })}
          </div>
        );
      })}
      {!upsideDown && (
        <div className={goalkeeperClassName}>
          <MappedCircleField
            player={goalkeeper}
            currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
            circleFieldProps={circleFieldProps}
            avoidResponsiveClasses={avoidResponsiveClasses}
            selectedPlayer={selectedPlayer}
          />
        </div>
      )}
    </div>
  );
};
