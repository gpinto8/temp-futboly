import { CustomCard } from "@/components/custom/custom-card";
import { CustomImage } from "@/components/custom/custom-image";
import { ShortTeamProps } from "@/firebase/db-types";
import { useAppSelector } from "@/store/hooks";
import { getRealTeamLogoById } from '@/utils/real-team-logos';

type MatchInfoType = {
    home: ShortTeamProps;
    away: ShortTeamProps;
    date: Date;
    result?: {
        home: number;
        away: number;
    };
};  //Copied from mocks.ts, to put in a shared file

type PersonalMatchProps = {
    type: "past" | "upcoming";
    matchInfo: MatchInfoType;
    className?: string;
};

export const PersonalMatch = ({type, matchInfo, className}: PersonalMatchProps) => {
    const user = useAppSelector((state) => state.user);
    return (
        <CustomCard style="gray" className={className}>
            <div className="flex flex-row gap-2 justify-around items-center">
                <div className="flex flex-row justify-center items-center gap-2 text-lg font-medium">
                    <CustomImage forceSrc={getRealTeamLogoById(matchInfo.home.logoId)?.src} className="h-8 w-8" />
                    <p className={user.username === matchInfo.home.ownerUsername? "text-main": ""}>{matchInfo.home.name}</p>
                </div>
                <div className="flex flex-col justify-center items-center text-sm">
                    { type === "past" && <div><p>{matchInfo.result?.home}</p> vs <p>{matchInfo.result?.away}</p></div>}
                    <p className={type==="past" ? "text-gray-400" : "text-black"}>{(new Date(matchInfo.date)).toLocaleString().split(",")[0]}</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2 text-lg font-medium">
                    <p className={user.username === matchInfo.away.ownerUsername ? "text-main" : ""}>{matchInfo.away.name}</p>
                    <CustomImage forceSrc={getRealTeamLogoById(matchInfo.away.logoId)?.src} className="h-8 w-8" />
                </div>
            </div>
        </CustomCard>
    );
}
