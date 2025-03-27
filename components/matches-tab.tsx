import { useGetMatches } from "@/data/matches/use-get-matches";
import { NoMatches } from "@/components/tabs/matches-tab/no-matches";
import { Matches } from "@/components/tabs/matches-tab/matches";

export const MatchesTab = () => {
    const { getPersonalMatches, getAllMatches, getMatchStatistics } = useGetMatches();
    const personalMatchHistory = getPersonalMatches();
    const allMatchHistory = getAllMatches();
    const personalStatistics = getMatchStatistics();

    return (
        <div>
            { allMatchHistory.length > 0 ? (
                <Matches personalMatchHistory={personalMatchHistory} allMatchHistory={allMatchHistory} matchStatistics={personalStatistics} />
            ) : (
                <NoMatches/>
            )}
        </div>
    );
}
