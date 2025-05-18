import { Avatar } from '@mui/material';
import { TeamPlayersData } from '../tabs/teams-tab/your-team';

export type CircleFieldProps = {
  player?: TeamPlayersData[0];
  handleClick?: () => void;
  isSelected?: boolean;
  selectedPlayerPosition?: string;
  avoidResponsiveClasses?: boolean;
  isAble?: boolean;
};

export const CircleField = ({
  player,
  handleClick,
  isSelected,
  avoidResponsiveClasses,
  isAble,
}: CircleFieldProps) => {
  const classes = [
    {
      container: 'w-16 h-16 min-w-16 min-h-16', // base
      avatar: 'h-5 w-5',
      name: 'text-[10px]',
      position: 'text-[8px]',
    },
    {
      container: 'sm:w-24 sm:h-24 sm:min-w-24 sm:min-h-24', // sm
      avatar: 'sm:h-6 sm:w-6',
      name: 'sm:text-sm',
      position: 'sm:text-xs',
    },
    {
      container: 'md:w-28 md:h-28 md:min-w-28 md:min-h-28', // md
      avatar: 'md:h-8 md:w-8',
      name: '',
      position: '',
    },
    {
      container: 'lg:w-14 lg:h-14 lg:min-w-14 lg:min-h-14', // lg
      avatar: 'lg:w-4 lg:h-4',
      name: 'lg:text-[10px]',
      position: 'lg:text-[8px]',
    },
    {
      container: 'xl:w-20 xl:h-20 xl:min-w-20 xl:min-h-20', // xl
      avatar: 'xl:w-6 xl:h-6',
      name: 'xl:text-[12px]',
      position: 'xl:text-[10px]',
    },
  ];

  const getClassesByInnerKey = (innerKey: keyof (typeof classes)[0]) => {
    return !avoidResponsiveClasses
      ? classes.map((value) => value[innerKey]).join(' ')
      : '';
  };

  return (
    <div
      onClick={isAble ? handleClick : undefined}
      className={`${
        isAble
          ? 'bg-white cursor-pointer hover:bg-lightGray'
          : 'bg-gray-300 cursor-not-allowed'
      } gap-2 w-16 h-16 md:w-20 md:h-20 text-center text-black rounded-full border-black border-2 ${
        isSelected ? 'border-[6px]' : ''
      } ${getClassesByInnerKey('container')}`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {player?.apiData?.image_path ? (
          <Avatar
            src={player?.apiData?.image_path}
            alt={player?.apiData?.display_name}
            className={`w-4 h-4 md:w-6 md:h-6 ${getClassesByInnerKey(
              'avatar',
            )}`}
          />
        ) : null}
        <div className={`w-max text-xs ${getClassesByInnerKey('name')}`}>
          {player?.apiData?.display_name}
        </div>
        <div
          className={`flex gap-1 items-baseline w-max text-[10px] text-gray-600 ${getClassesByInnerKey(
            'position',
          )}`}
        >
          {player?.apiData?.position?.developer_name?.slice(0, 3)}
          {player?.apiData?._score ? (
            <span className="text-error-500">({player?.apiData?._score})</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
