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
  <div className="overflow-auto w-auto flex">
    <div className="w-full h-auto min-w-[450px] md:min-w-full md:!w-[850px] md:!h-[660px]">
      <div
        className={`relative w-full min-w-[450px] md:min-w-full h-auto md:!w-[850px]`}
      >
        <div className="absolute gap-4 w-full h-full flex justify-between">
          {/* MOBILE */}
          <div className="flex md:hidden flex-col justify-between gap-4 w-full">
            <div className="w-full h-1/2">
              <CircleFieldMatchingFormation
                formation={homeData.formation!}
                players={homeData.players}
                orientation="top-to-bottom"
              />
            </div>
            <div className="w-full h-1/2">
              <CircleFieldMatchingFormation
                formation={awayData.formation!}
                players={awayData.players}
              />
            </div>
          </div>
          {/* DESKTOP */}
          <div className="hidden md:flex justify-between w-full h-full gap-4">
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
        </div>

        {/* MOBILE */}
        <CustomImage
          imageKey="FOOTBALL_FIELD"
          className="block md:hidden w-full"
        />
        {/* DESKTOP */}
        <CustomImage
          imageKey="FOOTBALL_FIELD_HORIZONTAL"
          className="hidden md:block !w-[850px] !h-[650px]"
        />
      </div>
    </div>
  </div>
);
