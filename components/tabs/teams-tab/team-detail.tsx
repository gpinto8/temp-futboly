import { MatchTeamType, PlayerType } from "@/components/tabs/live-match-tab/live-match-section";
import { CustomCard } from "@/components/custom/custom-card";
import { CustomImage } from "@/components/custom/custom-image";

export const TeamDetail = ({team}: {team: MatchTeamType}) => {
    return (
        <div className="grid grid-cols-2">
            <div>
                <h2 className="text-lg md:text-xl font-bold">Starting 11</h2>
            </div>
            <div className="px-8">
                <h2 className="text-lg md:text-xl font-bold">Bench</h2>
                <div className="flex justify-between items-center font-semibold">
                    <div>Player</div>
                    <div>Score</div>
                    <div>Role</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                {team.bench.map((player: PlayerType, index: number) => (
                    <CustomCard key={index} style="gray" size="slim" className="w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center">
                                <CustomImage forceSrc={player.image} className={"border rounded-full" + (player.isCaptain ? " border-error-500" : "")}/>
                                <p>{player.name}</p>
                            </div>
                            <div>{player.points}</div>
                            <div>{player.position}</div>
                        </div>
                    </CustomCard>
                ))}
                </div>
            </div>
        </div>
    );
};