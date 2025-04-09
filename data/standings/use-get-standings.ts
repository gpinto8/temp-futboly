import { useAppSelector } from "@/store/hooks";
import { useGetTeams } from "../teams/use-get-teams";
import { StandingsResults } from "@/firebase/db-types";
import cloneDeep from 'lodash/cloneDeep';

export const useGetStandings = () => {
    const activeCompetition = useAppSelector((state) => state.competition.activeCompetition);
    const { getAllTeams } = useGetTeams();

    const getActiveCompetitionStandings = async () => {
        if (!activeCompetition) return;
        if (!activeCompetition.matchSchedule) return;
        const matchesWithResult = [...activeCompetition.matchSchedule].filter((match) => Boolean(match.result));
        const allCompetitionTeams = await getAllTeams();
        if (!allCompetitionTeams) return;
        const mapTeamMatches: any[] = [];
        for (let i = 0; i < allCompetitionTeams.length; i++) {
            const team = allCompetitionTeams[i];
            const teamMatches = matchesWithResult.filter((match) => (team.shortId === match.home.shortId || team.shortId === match.away.shortId));
            const teamResults = teamMatches.map((match) => {
                if (!match.result) return null;
                const winner = match.result.home > match.result.away ? match.home : match.result.home !== match.result.away ? match.away : "Draw";
                return winner === "Draw" ? "D" : team.shortId === winner.shortId ? "W" : "L";
            }).filter((result) => result !== null);
            const teamClone = cloneDeep(team);
            const resultCounts = teamResults.reduce(
                (acc, result) => {
                    if (result !== "W" && result !== "L" && result !== "D") {
                        return acc; // Skip all the invalid results
                    }
                    const points = result === "W" ? 3 : result === "D" ? 1 : 0;
                    acc[result] = (acc[result] || 0) + 1;
                    acc.points += points;
                    return acc;
                },
                { W: 0, L: 0, D: 0, points: 0 } // Initialization
            );
            const standingsResults: StandingsResults = {
                lastMatches: teamResults,
                ...resultCounts
            };
            teamClone.results = standingsResults;
            mapTeamMatches.push(teamClone);
        }
        return mapTeamMatches.sort((a, b) => a.results.points - b.results.points).toReversed();
    };

    return {
        getActiveCompetitionStandings,
    };
};
