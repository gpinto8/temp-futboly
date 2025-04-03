import { CustomImage } from "@/components/custom/custom-image";
import { Avatar } from '@mui/material';
import { CustomSeparator } from "@/components/custom/custom-separator";
import { LiveMatchProps } from "@/data/matches/use-get-matches"; 
import { getRealTeamLogoById } from "@/utils/real-team-logos";
import { useAppSelector } from "@/store/hooks";

export const LiveMatchSection = ({ nextMatch }: { nextMatch: LiveMatchProps }) => {
    const user = useAppSelector((state) => state.user);
    const { home, away, week, result } = nextMatch;
    const homeTeamLogo = getRealTeamLogoById(home.logoId);
    const awayTeamLogo = getRealTeamLogoById(away.logoId);
    const homeClass = nextMatch.home.userRef.id === user.id ? "text-main" : "";
    const awayClass = nextMatch.away.userRef.id === user.id ? "text-main" : "";

    return (
      <div className="flex flex-row items-center justify-between gap-8 mt-8">
        <div id="homeTeamLive">
            <h2 className="text-l font-medium my-2">{nextMatch.home.name} LineUp</h2>
            <CustomSeparator withText={false} />
            <div id="homeTeamLineUp">
                {home.players.length > 0 ? home.players.map((player, index: number) => (
                    <div key={index} className="flex flex-row items-center gap-2">
                        <p className="font-bold text-error">{(player.position?.developer_name) ? (player.position?.developer_name)?.slice(0,3) : "UNK" }</p>
                        <p className="font-semibold">{player.common_name}</p>
                        <Avatar src={player.image_path} alt={player.display_name} sx={{ width: 24, height: 24 }}/>
                    </div>
                )) : (<div>Loading...</div>)}
                <CustomSeparator withText={false} />
                {/* I was expecting a bench that will be smaller and in gray
                home.bench.map((player, index: number) => (
                    <div key={index} className="flex flex-row items-center gap-2">
                        <p className="font-bold text-gray-600">{(player.position?.developer_name) ? (player.position?.developer_name)?.slice(0,3) : "UNK" }</p>
                        <p className="font-semibold text-gray-600">{player.name}</p>
                        <Avatar src={player.image_path} alt={player.display_name} sx={{ width: 24, height: 24 }}/>
                    </div>
                )) */}
            </div>
        </div>
        <div id="centerSection" className="grow h-full self-start">
            <div className="flex justify-around items-center my-4">
                <div className="flex flex-row gap-4 items-center">
                    <CustomImage forceSrc={homeTeamLogo?.src} forcedAlt={homeTeamLogo?.alt} className="h-12 w-12" />
                    <div>
                        <p className={homeClass + " font-bold text-l"}>{home.name}</p>
                        <p className="font-medium text-md text-gray-600">Posizione</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    { result && (
                        <div className="flex flex-row gap-2 justify-center items-center"><p className="font-bold text-error-400">{result.home}</p> vs <p className="font-bold text-main-400" >{result.away}</p></div>
                    )}
                    <p className="font-semibold text-gray-600">Week {week}</p>
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <CustomImage forceSrc={awayTeamLogo?.src} forcedAlt={awayTeamLogo?.alt} className="h-12 w-12" />
                    <div>
                        <p className={awayClass + " font-bold text-l"}>{away.name}</p>
                        <p className="font-medium text-md text-gray-600">Posizione</p>
                    </div>
                </div>
            </div>
            <div className="bg-success-600 w-full h-full text-center border-4 border-black">

            </div>
        </div>
        <div id="awayTeamLive">
            <h2 className="text-l font-medium my-2">{nextMatch.away.name} LineUp</h2>
            <CustomSeparator withText={false} />
            <div id="awayTeamLineUp">
                {away.players.length > 0 ? away.players.map((player, index: number) => (
                    <div key={index} className="flex flex-row items-center gap-2">
                        <p className="font-bold text-error">{(player.position?.developer_name) ? (player.position?.developer_name)?.slice(0,3) : "UNK" }</p>
                        <p className="font-semibold">{player.common_name}</p>
                        <Avatar src={player.image_path} alt={player.display_name} sx={{ width: 24, height: 24 }}/>
                    </div>
                )) : (<div>Loading...</div>)}
                <CustomSeparator withText={false} />
                {/* away.bench.map((player, index: number) => (
                    <div key={index} className="flex flex-row items-center gap-2">
                        <p className="font-bold text-gray-600">{(player.position?.developer_name) ? (player.position?.developer_name)?.slice(0,3) : "UNK" }</p>
                        <p className="font-semibold text-gray-600">{player.name}</p>
                        <Avatar src={player.image_path} alt={player.display_name} sx={{ width: 24, height: 24 }}/>
                    </div>
                ))*/}
            </div>
        </div>
      </div>
    );
}

