import { CustomImage } from "@/components/custom/custom-image";
import { CustomSeparator } from "@/components/custom/custom-separator";

export const LiveMatchSection = ({ home, away, score } : CurrentLiveMatchType) => {
    return (
      <div className="flex flex-row items-center justify-between gap-8 mt-8">
        <div id="homeTeamLive">
            <h2 className="text-l font-medium my-2">Home Team LineUp</h2>
            <CustomSeparator withText={false} />
            <div id="homeTeamLineUp">
                {home.players.map((player) => (
                    <div className="flex flex-row items-center gap-2">
                        <p className="font-bold text-error">{player.position}</p>
                        <p className="font-semibold">{player.name}</p>
                        {/* <CustomImage forceSrc={player.image} className="h-12 w-12" /> */}
                    </div>
                ))}
                <CustomSeparator withText={false} />
                {home.bench.map((player) => (
                    <div className="flex flex-row items-center gap-2">
                    <p className="font-bold text-gray-600">{player.position}</p>
                    <p className="font-semibold text-gray-600">{player.name}</p>
                    {/* <CustomImage forceSrc={player.image} className="h-12 w-12" /> */}
                </div>
                ))}
            </div>
        </div>
        <div id="centerSection" className="grow h-full self-start">
            <div className="flex justify-around items-center my-4">
                <div className="flex flex-row gap-4 items-center">
                    <CustomImage forceSrc={home.teamLogo} className="h-12 w-12" />
                    <div>
                        <p className="font-bold text-l">{home.teamName}</p>
                        <p className="font-semibold text-l text-gray-600">{home.teamName}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-row gap-2 justify-center items-center"><p className="font-bold text-error-400">{score.home}</p> vs <p className="font-bold text-main-400" >{score.away}</p></div>
                    <p className="font-semibold text-gray-600">Week 1</p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <CustomImage forceSrc={away.teamLogo} className="h-12 w-12" />
                    <div>
                        <p className="font-bold text-l">{away.teamName}</p>
                        <p className="font-semibold text-l text-gray-600">{away.teamName}</p>
                    </div>
                </div>
            </div>
            <div className="bg-success-600 w-full h-full text-center border-4 border-black">

            </div>
        </div>
        <div id="awayTeamLive">
            <h2 className="text-l font-medium my-2">Away Team LineUp</h2>
            <CustomSeparator withText={false} />
            <div id="awayTeamLineUp">
                {away.players.map((player) => (
                    <div className="flex flex-row items-center gap-2">
                        <p className="font-bold text-error">{player.position}</p>
                        <p className="font-semibold">{player.name}</p>
                        {/* <CustomImage forceSrc={player.image} className="h-12 w-12" /> */}
                    </div>
                ))}
                <CustomSeparator withText={false} />
                {away.bench.map((player) => (
                    <div className="flex flex-row items-center gap-2">
                    <p className="font-bold text-gray-600">{player.position}</p>
                    <p className="font-semibold text-gray-600">{player.name}</p>
                    {/* <CustomImage forceSrc={player.image} className="h-12 w-12" /> */}
                </div>
                ))}
            </div>
        </div>
      </div>
    );
}

type CurrentLiveMatchType = {
    home: MatchTeamType;
    away: MatchTeamType;
    score: {
        home: number;
        away: number;
    };
};

export type MatchTeamType = {
    teamName: string;
    teamLogo: string;
    position: number;
    module: string;
    players: PlayerType[];
    bench: PlayerType[];
};

export type PlayerType = {
    name: string;
    image: string;
    position: string;
    shirtNumber: number;
    points: number;
    isCaptain: boolean;
};