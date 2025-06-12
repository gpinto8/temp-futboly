import { Avatar } from '@mui/material';
import { CustomImage } from '../custom/custom-image';
import { useEffect, useState } from 'react';
import { getSportmonksPlayerDataById } from '@/sportmonks/common-methods';

type BenchRowProps = {
  sportmonksId: number;
  handleClose: () => void;
  movePlayerUp: () => void;
  movePlayerDown: () => void;
};

export const BenchRow = ({
  sportmonksId,
  handleClose,
  movePlayerUp,
  movePlayerDown,
}: BenchRowProps) => {
  const [playerData, setPlayerData] = useState<any>();

  useEffect(() => {
    (async () => {
      if (sportmonksId) {
        const data = await getSportmonksPlayerDataById(sportmonksId);
        if (data) setPlayerData(data);
      }
    })();
  }, [sportmonksId]);

  return (
    <div className="flex gap-4 items-baseline justify-between">
      <CustomImage
        imageKey="CLOSE_ICON"
        width={12}
        height={12}
        onClick={handleClose}
        className="cursor-pointer"
      />
      <Avatar
        src={playerData?.image_path}
        alt={playerData?.display_name}
        className="w-4 h-4"
      />
      <div className="line-clamp-1 w-3/5">{playerData?.display_name || ''}</div>
      <div className="line-clamp-1 w-1/5">
        {playerData?.position?.developer_name.slice(0, 3) || ''}
      </div>
      <div className="flex">
        <CustomImage
          className="cursor-pointer"
          imageKey="ARROW_UP"
          height={16}
          width={16}
          onClick={movePlayerUp}
        />
        <CustomImage
          className="cursor-pointer"
          imageKey="ARROW_DOWN"
          height={16}
          width={16}
          onClick={movePlayerDown}
        />
      </div>
    </div>
  );
};
