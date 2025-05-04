import { CustomCard } from '@/components/custom/custom-card';
import { CustomImage } from '@/components/custom/custom-image';
import { MatchScheduleProps } from '@/firebase/db-types';
import { useAppSelector } from '@/store/hooks';
import { getCustomTeamLogoById } from '@/utils/real-team-logos';

type PersonalMatchProps = {
  type: 'past' | 'upcoming';
  matchInfo: MatchScheduleProps;
  className?: string;
};

export const PersonalMatch = ({
  type,
  matchInfo,
  className,
}: PersonalMatchProps) => {
  const user = useAppSelector((state) => state.user);
  const homeLogo = getCustomTeamLogoById(matchInfo?.home?.logoId);
  const awayLogo = getCustomTeamLogoById(matchInfo?.away?.logoId);
  return (
    <CustomCard style="gray" className={className}>
      <div className="flex flex-row gap-2 justify-around items-center p-1 md:p-0">
        <div className="flex flex-row justify-center items-center gap-2 text-lg font-medium">
          <CustomImage
            forceSrc={homeLogo?.src}
            forcedAlt={homeLogo?.alt}
            className="h-8 w-8"
          />
          <p className={user.id === matchInfo.home.userId ? 'text-main' : ''}>
            {matchInfo.home.name}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center text-sm">
          {type === 'past' && (
            <div className="flex justify-center items-center text-lg gap-1">
              <p>{matchInfo.result?.home}</p> - <p>{matchInfo.result?.away}</p>
            </div>
          )}
          <p
            className={type === 'past' ? 'text-gray-400 text-xs' : 'text-black'}
          >
            {new Date(matchInfo.date).toLocaleString().split(',')[0]}
          </p>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 text-lg font-medium">
          <p className={user.id === matchInfo.away.userId ? 'text-main' : ''}>
            {matchInfo.away.name}
          </p>
          <CustomImage
            forceSrc={awayLogo?.src}
            forcedAlt={awayLogo?.alt}
            className="h-8 w-8"
          />
        </div>
      </div>
    </CustomCard>
  );
};
