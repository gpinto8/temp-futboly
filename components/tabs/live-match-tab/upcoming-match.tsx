import { CustomCard } from "@/components/custom/custom-card";
import { CustomImage } from "@/components/custom/custom-image";
import { MatchScheduleProps } from "@/firebase/db-types";
import { getRealTeamLogoById } from '@/utils/real-team-logos';
import { useAppSelector } from "@/store/hooks";

export const UpcomingMatch = ({matchInfo}: {matchInfo: MatchScheduleProps}) => {
    const user = useAppSelector((state) => state.user);
    const homeClass = matchInfo.home.ownerUsername === user.username ? "text-main" : "";
    const awayClass = matchInfo.away.ownerUsername === user.username ? "text-main" : "";

    return (
        <CustomCard style="gray">
            <div className="text-center ">
                <div className="flex flex-row gap-4">
                    <CustomImage
                    forceSrc={getRealTeamLogoById(matchInfo.home.logoId)?.src}
                    forcedAlt={getRealTeamLogoById(matchInfo.home.logoId)?.alt}
                    className="h-12 lg:h-16 w-12 lg:w-16"
                    width={32}
                    height={32}
                    />
                    <CustomImage
                    forceSrc={getRealTeamLogoById(matchInfo.away.logoId)?.src}
                    forcedAlt={getRealTeamLogoById(matchInfo.away.logoId)?.alt}
                    className="h-12 lg:h-16 w-12 lg:w-16"
                    width={32}
                    height={32}
                    />
                </div>
                <p className={homeClass + " font-semibold"}>{matchInfo.home.name}</p>
                <p className="font-semibold">vs</p>
                <p className={awayClass + " font-semibold"}>{matchInfo.away.name}</p>
            </div>
        </CustomCard>
    );
}
