import { CustomCard } from "@/components/custom/custom-card";
import { MatchTeamType } from "@/components/tabs/live-match-tab/live-match-section";
import { CustomImage } from "@/components/custom/custom-image";

type MinimalMatchTeamType = Pick<MatchTeamType, "teamName" | "teamLogo">;

type MatchInfoType = {
    home: MinimalMatchTeamType;
    away: MinimalMatchTeamType;
    date: Date;
    score?: {
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
    return (
        <CustomCard style="gray" className={className}>
            <div className="flex flex-row gap-2 justify-around items-center">
                <div className="flex flex-row justify-center items-center gap-2 text-lg font-medium">
                    <p className="text-main">{matchInfo.home.teamName}</p>
                    <CustomImage forceSrc={matchInfo.home.teamLogo} className="h-8 w-8" />
                </div>
                <div className="flex flex-col justify-center items-center text-sm">
                    { type === "past" && <div><p>{matchInfo.score?.home}</p> vs <p>{matchInfo.score?.away}</p></div>}
                    <p className={type==="past" ? "text-gray-400" : "text-black"}>{matchInfo.date.toLocaleString().split(",")[0]}</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2 text-lg font-medium">
                    <p>{matchInfo.away.teamName}</p>
                    <CustomImage forceSrc={matchInfo.away.teamLogo} className="h-8 w-8" />
                </div>
            </div>
        </CustomCard>
    );
}