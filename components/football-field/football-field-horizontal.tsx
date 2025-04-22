import { CustomImage } from '../custom/custom-image';
import { AllPosibleFormationsProps } from '@/utils/formations';
import { CircleFieldMatchingFormation } from './circle-field-matching-formation';
import { TeamPlayersData } from '../tabs/teams-tab/your-team';

type PlayerData = {
  formation?: AllPosibleFormationsProps;
  players: TeamPlayersData;
};

type FootballFieldHorizontalProps = {
  homeData: PlayerData;
  awayData: PlayerData;
};

export const FootballFieldHorizontal = ({
  homeData,
  awayData,
}: FootballFieldHorizontalProps) => (
  <div className="w-full md:!w-[850px] !h-[660px] overflow-scroll overflow-y-hidden">
    <div className={`relative !w-[850px]`}>
      <div className="absolute gap-4 w-full h-full flex justify-between">
        <CircleFieldMatchingFormation
          formation={homeData.formation!}
          players={homeData.players}
          orientation="left-to-right"
          avoidResponsiveClasses
        />
        <CircleFieldMatchingFormation
          formation={awayData.formation!}
          players={awayData.players}
          orientation="right-to-left"
          avoidResponsiveClasses
        />
      </div>
      <CustomImage
        imageKey="FOOTBALL_FIELD_HORIZONTAL"
        className="!w-[850px] !h-[650px]"
      />
    </div>
  </div>
);
