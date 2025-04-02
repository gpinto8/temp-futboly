import { CustomButton } from "@/components/custom/custom-button";
import { CustomSeparator } from "@/components/custom/custom-separator";
import { UpcomingMatch } from "@/components/tabs/live-match-tab/upcoming-match";
import { LiveMatchSection } from "@/components/tabs/live-match-tab/live-match-section";
import { useGetMatches } from "@/data/matches/use-get-matches";

export const LiveMatch = () => {
    const { getUpcomingMatches, getNextMatch } = useGetMatches();
    const upcomingMatches = getUpcomingMatches(5);
    const nextMatch = getNextMatch();

    return nextMatch ? (
        <div>
            <div id="currentLiveMatch">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="font-bold text-4xl text-main text-nowrap">Current Live Match</h1>
                    <CustomButton label="Refresh match" className="rounded-full py-1 px-2 max-w-36"/>
                </div>
                <LiveMatchSection nextMatch={nextMatch} />
            </div>
            <CustomSeparator withText={false} />
            <div id="upcomingMatches">
                <h1 className="font-bold text-4xl text-main mb-4">Upcoming Matches</h1>
                <div className="flex flex-row justify-center items-center gap-4">
                    { upcomingMatches.length > 0 ? (
                        upcomingMatches.map((upcomingMatch, index) => (
                            <UpcomingMatch key={index} matchInfo={upcomingMatch}/>
                        ))
                    ) : (
                        <p>There are no matches left for this competitions</p>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div>
            Match non trovato
        </div>
    );
}
