import { CustomCard } from '@/components/custom/custom-card';
import { CustomImage } from '@/components/custom/custom-image';
import { MatchScheduleProps } from '@/firebase/db-types';
import { getCustomTeamLogoById } from '@/utils/real-team-logos';
import { useGetUsers } from '@/data/users/use-get-users';

export const UpcomingMatch = ({
  matchInfo,
}: {
  matchInfo: MatchScheduleProps;
}) => {
  const { getUser } = useGetUsers();

  const homeClass = matchInfo.home.userId === getUser().id ? 'text-main' : '';
  const awayClass = matchInfo.away.userId === getUser().id ? 'text-main' : '';

  return (
    <CustomCard style="gray" className="w-full md:max-w-fit">
      <div className="text-center flex flex-col gap-4">
        <div className="flex flex-row gap-4 justify-center">
          <CustomImage
            forceSrc={getCustomTeamLogoById(matchInfo.home.logoId)?.src}
            forcedAlt={getCustomTeamLogoById(matchInfo.home.logoId)?.alt}
            className="h-12 lg:h-16 w-12 lg:w-16"
            width={32}
            height={32}
          />
          <CustomImage
            forceSrc={getCustomTeamLogoById(matchInfo.away.logoId)?.src}
            forcedAlt={getCustomTeamLogoById(matchInfo.away.logoId)?.alt}
            className="h-12 lg:h-16 w-12 lg:w-16"
            width={32}
            height={32}
          />
        </div>
        <div className="w-full">
          <p className={homeClass + ' font-semibold'}>{matchInfo.home.name}</p>
          <p className="font-semibold">vs</p>
          <p className={awayClass + ' font-semibold'}>{matchInfo.away.name}</p>
        </div>
      </div>
    </CustomCard>
  );
};
