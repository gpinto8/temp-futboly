import { Avatar } from '@mui/material';
import { TeamPlayersData } from '../tabs/teams-tab/your-team';

export type CircleFieldProps = {
  player?: TeamPlayersData[0];
  handleClick?: () => void;
  isSelected?: boolean;
  selectedPlayerPosition?: string;
};

export const CircleField = ({
  player,
  handleClick,
  isSelected,
}: CircleFieldProps) => (
  <div
    onClick={handleClick}
    className={`gap-2 !bg-white hover:bg-lightGray w-12 h-12 sm:w-20 sm:h-20 md:w-20 md:h-20 cursor-pointer text-center text-black rounded-full border-black border-2 ${
      isSelected ? 'border-[6px]' : ''
    }`}
  >
    <div className="w-full flex flex-col items-center justify-center h-full overflow-hidden">
      {player?.apiData?.image_path ? (
        <Avatar
          src={player?.apiData?.image_path}
          alt={player?.apiData?.display_name}
          className="h-4 w-4 sm:h-6 sm:w-6 md:h-6 md:w-6"
        />
      ) : null}
      <div className="text-xs w-max">{player?.apiData?.display_name}</div>
      <div className="text-[10px] w-max text-gray-600">
        {player?.apiData?.position?.name}
      </div>
    </div>
  </div>
);
