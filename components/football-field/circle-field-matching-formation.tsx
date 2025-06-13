import {
  TEAMS_GOALKEEPER_FORMATION_POSITION,
  TEAMS_MAX_BENCH_PLAYERS,
} from '@/firebase/db-types';
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CustomImage } from '../custom/custom-image';
import { getSportmonksPlayerDataById } from '@/sportmonks/common-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { teamActions } from '@/store/slices/team';
import { BenchRow } from './bench-row';

type MappedCircleFieldProps = {
  player: TeamPlayersData[0];
  currentPosition: FormationPosition;
  circleFieldProps: CircleFieldMatchingFormationProps['circleFieldProps'];
  avoidResponsiveClasses: CircleFieldProps['avoidResponsiveClasses'];
  selectedPlayer?: RowsProps<
    SelectableTableColumnKeysProps<YourTeamKeyProps>
  >[0];
  getPlayerBenchSelected?: CircleFieldProps['getPlayerBenchSelected'];
};

const MappedCircleField = ({
  player,
  currentPosition,
  circleFieldProps,
  avoidResponsiveClasses,
  selectedPlayer,
  getPlayerBenchSelected,
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
      getPlayerBenchSelected={getPlayerBenchSelected}
    />
  );
};
type CircleFieldMatchingFormationProps = {
  formation: AllPosibleFormationsProps;
  players: TeamPlayersData;
  setPlayers: Dispatch<SetStateAction<TeamPlayersData>>;
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
  setSelectedPlayer?: Dispatch<SetStateAction<any>>;
};

export const CircleFieldMatchingFormation = ({
  formation,
  players,
  setPlayers,
  orientation = 'bottom-to-top', // This is the default
  circleFieldProps,
  avoidResponsiveClasses,
  selectedPlayer,
  setSelectedPlayer,
}: CircleFieldMatchingFormationProps) => {
  const benchMode = useAppSelector((state) => state.team.benchMode);
  const dispatch = useAppDispatch();

  const [benchPlayer, setBenchPlayer] = useState<any>();
  const [benchPlayerPosition, setBenchPlayerPosition] = useState<
    number | null
  >();

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

  mainClassName += !benchMode ? ' p-2' : ''; // Add a little padding when is not in bench mode

  const goalkeeper = players?.find(
    (player) => player?.position === TEAMS_GOALKEEPER_FORMATION_POSITION,
  ) as TeamPlayersData[0];

  const upsideDown =
    orientation === 'left-to-right' || orientation === 'top-to-bottom'; // This is done so the goalkeeper is placed correctly and also the formation based on these orientations

  useEffect(() => {
    const sportmonksId = selectedPlayer?.ID;

    // If both the bench plus icon AND a player from the table of all players ARE SELECTED, then i can add it
    if ((benchPlayerPosition === 0 || benchPlayerPosition) && sportmonksId) {
      const newPlayers = [...(players || [])];
      const benchPlayerSportmonksId = benchPlayer?.id;
      const foundPlayer = newPlayers.find(
        (player) => player.sportmonksId === benchPlayerSportmonksId,
      );

      const bench = [...(foundPlayer?.bench || [])];
      bench[benchPlayerPosition] = sportmonksId;

      const index = newPlayers.findIndex(
        (player) => player.sportmonksId === benchPlayerSportmonksId,
      );

      newPlayers[index] = { ...foundPlayer, bench } as any;
      setPlayers(newPlayers);

      setBenchPlayerPosition(null);
      setTimeout(() => setSelectedPlayer?.(Math.random()), 250);
    }
  }, [benchPlayerPosition, selectedPlayer]);

  const getPlayerBenchSelected = async (sportmonksId: number) => {
    if (sportmonksId) {
      dispatch(teamActions.setBenchMode(true));

      const playerData = await getSportmonksPlayerDataById(sportmonksId);
      if (playerData) {
        dispatch(teamActions.setBenchPlayer(playerData));
        setBenchPlayer(playerData);
      }
    }
  };

  const addPlayerToBench = (index: number) => {
    if (index === benchPlayerPosition) setBenchPlayerPosition(null);
    else setBenchPlayerPosition(index);
  };

  const movePlayer = (sportmonksId: number, direction: 'up' | 'down') => {
    const newPlayers = [...(players || [])];
    const benchPlayerSportmonksId = benchPlayer?.id;
    const foundPlayer = players.find(
      (player) => player.sportmonksId === benchPlayerSportmonksId,
    );
    const bench = foundPlayer?.bench;

    const currentIndex = bench?.indexOf(sportmonksId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === TEAMS_MAX_BENCH_PLAYERS - 1)
    )
      return;

    if (currentIndex || currentIndex === 0) {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const newPlayersInBench = [...(bench || [])];
      const removedPlayer = newPlayersInBench[newIndex];
      newPlayersInBench[newIndex] = sportmonksId; // Add player to the new position
      newPlayersInBench[currentIndex] = removedPlayer; // Replace the removed player to the current position

      const index = players.findIndex(
        (player) => player.sportmonksId === benchPlayerSportmonksId,
      );
      newPlayers[index] = { ...foundPlayer, bench: newPlayersInBench } as any;
      setPlayers(newPlayers);
    }
  };

  const deletePlayerFromBench = (sportmonksId: number) => {
    const newPlayers = [...(players || [])];
    const benchPlayerSportmonksId = benchPlayer?.id;
    const foundPlayer = players.find(
      (player) => player.sportmonksId === benchPlayerSportmonksId,
    );
    const benchIndex = foundPlayer?.bench?.indexOf(sportmonksId);

    if ((benchIndex || benchIndex === 0) && foundPlayer) {
      const newBench = [...(foundPlayer?.bench || [])];
      newBench[benchIndex] = undefined;

      const index = players.findIndex(
        (player) => player.sportmonksId === benchPlayerSportmonksId,
      );
      newPlayers[index] = { ...foundPlayer, bench: newBench } as any;
      setPlayers(newPlayers);
    }
  };

  return (
    <div className={mainClassName}>
      {/* BENCH */}
      {benchMode ? (
        <div className="relative w-full h-full">
          <div className="absolute bg-gray-300 opacity-40 z-50 w-full h-full" />
          <div className="absolute z-50 w-full h-full flex justify-center items-center">
            <div className="w-[65%] h-[30%] rounded-2xl bg-white p-4 flex flex-col gap-6">
              {/* TITLE */}
              <div className="flex justify-between">
                <span className="font-bold">
                  Bench{' '}
                  <span className="text-xs font-semibold">{`(${benchPlayer?.common_name})`}</span>
                </span>
                <CustomImage
                  imageKey="CLOSE_ICON"
                  width={16}
                  height={16}
                  onClick={() => dispatch(teamActions.setBenchMode(false))}
                  className="cursor-pointer"
                />
              </div>
              {/* PLAYERS */}
              <div className="flex flex-col gap-3 overflow-auto">
                {players
                  ?.find((player) => player.sportmonksId === benchPlayer?.id)
                  ?.bench?.map((sportmonksId, index) =>
                    sportmonksId ? (
                      <BenchRow
                        key={index}
                        sportmonksId={sportmonksId}
                        handleClose={() => deletePlayerFromBench(sportmonksId)}
                        movePlayerUp={() => movePlayer(sportmonksId, 'up')}
                        movePlayerDown={() => movePlayer(sportmonksId, 'down')}
                      />
                    ) : (
                      <div key={index} className="w-full flex justify-center">
                        <CustomImage
                          imageKey={
                            index === benchPlayerPosition
                              ? 'CHECK_ICON'
                              : 'PLUS_ICON'
                          }
                          height={24}
                          width={24}
                          className="cursor-pointer"
                          onClick={() => addPlayerToBench(index)}
                        />
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {upsideDown && (
            <div className={goalkeeperClassName}>
              <MappedCircleField
                player={goalkeeper}
                currentPosition={TEAMS_GOALKEEPER_FORMATION_POSITION}
                circleFieldProps={circleFieldProps}
                avoidResponsiveClasses={avoidResponsiveClasses}
                selectedPlayer={selectedPlayer}
                getPlayerBenchSelected={getPlayerBenchSelected}
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
                      const formationDigits =
                        formation?.split('+')?.[0]?.length;
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
                        getPlayerBenchSelected={getPlayerBenchSelected}
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
                getPlayerBenchSelected={getPlayerBenchSelected}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
