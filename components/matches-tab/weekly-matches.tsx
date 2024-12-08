import { MatchTeamType } from "@/components/live-match/live-match-section";
import { CustomSeparator } from "@/components/custom/custom-separator";
import { CustomImage } from "../custom/custom-image";

type MinimalMatchTeamType = Pick<MatchTeamType, "teamName" | "teamLogo">;

type MatchInfoType = {
    home: MinimalMatchTeamType;
    away: MinimalMatchTeamType;
    date: Date;
    score?: {
        home: number;
        away: number;
    };
};

export const WeeklyMatches = ({matches}: {matches: MatchInfoType[]}) => {
    return (
        <div>
            <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-500">Date</p>
                <p className="font-semibold text-gray-500">Match</p>
                <p className="font-semibold text-gray-500">Result</p>
            </div>
            <CustomSeparator withText={false} />
            <div className="flex flex-col justify-between items-center gap-2">
                {matches.map((match, index) => (
                    <div key={index} className="w-full flex justify-between items-center">
                        <p className="font-semibold text-gray-900">{match.date.toLocaleString().split(",")[0]}</p>
                        <div className="flex justify-center items-center gap-4">
                            <div className="flex justify-center items-center gap-2">
                                <p className="font-semibold text-gray-900">{match.home.teamName}</p>
                                <CustomImage forceSrc={match.home.teamLogo} className="h-8 w-8" />
                            </div>
                            <p>vs</p>
                            <div className="flex justify-center items-center gap-2">
                                <p className="font-semibold text-gray-900">{match.away.teamName}</p>
                                <CustomImage forceSrc={match.away.teamLogo} className="h-8 w-8" />
                            </div>
                        </div>
                        <div>{match.score ? (
                                <div className="flex justify-center items-center gap-2">
                                    <p className="font-semibold text-gray-900">{match.score.home}</p>
                                    <p className="font-semibold text-gray-900">-</p>
                                    <p className="font-semibold text-gray-900">{match.score.away}</p>
                                </div>
                            ) : (
                                <p className="font-semibold text-gray-700">Upcoming</p>
                            )}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}