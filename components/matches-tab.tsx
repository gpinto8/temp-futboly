import { useEffect } from "react";
import { CustomCard } from "./custom/custom-card";
import { CustomSeparator } from "./custom/custom-separator";
import { PersonalMatch } from "@/components/matches-tab/personal-match";
import { getMockupMatchesHistory } from "@/utils/mocks";

const statistics = [
    {title: "Total Wins", value: 0},
    {title: "Total Matches Played", value: 2},
    {title: "Overall Score", value: 89},
    {title: "Score This Week", value: 40}
];

const matchesHistory = getMockupMatchesHistory();

export const Matches = () => {

    const resizeAllMatches = () => {
        const personaleUpcomingMatches = document.getElementById("personaleUpcomingMatches")?.querySelector("div");
        const personalHistoryMatches = document.getElementById("personalHistoryMatches")?.querySelector("div");
        if (personalHistoryMatches?.clientHeight && personalHistoryMatches?.style && personaleUpcomingMatches?.clientHeight !== personalHistoryMatches?.clientHeight) {
            personalHistoryMatches.style.height = personaleUpcomingMatches?.clientHeight + "px";
        }
    }

    useEffect(() => {
        resizeAllMatches();
    }, []);

    return (
        <div>
            <h1 className = "text-2xl md:text-4xl font-bold my-4">Your Matches</h1>
            <div>
                <div id="personalMatches" className="my-4 grid grid-cols-2">
                    <div id="personaleUpcomingMatches">
                        <h2 className="text-lg md:text-xl font-bold">Upcoming Matches</h2>
                        <div className="px-14 md:px-24">
                            { matchesHistory.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0,3).map((match, index) => {return(
                                <PersonalMatch key={index} type="upcoming" matchInfo={match} className="my-2"/>
                            )})}
                        </div>
                    </div>
                    <div id="personalHistoryMatches">
                        <h2 className="text-lg md:text-xl font-bold">All Matches</h2>
                        <div className="px-14 md:px-24 overflow-y-auto main-scrollbar">
                            { matchesHistory.sort((a, b) => a.date.getTime() - b.date.getTime()).map((match, index) => {return(
                                <PersonalMatch key={index} type="upcoming" matchInfo={match} className="my-2"/>
                            )})}
                        </div>
                    </div>
                </div>
                <div id="personalStatistics">
                    <h2 className="text-lg md:text-xl font-bold">Match Statistics</h2>
                    <div className="flex flex-column sm:flex-row gap-4 justify-center items-center">
                        { statistics.map(({title: cardTitle, value}, index) => {
                            return (
                            <CustomCard key={index} style="gray">
                                <h3 className="text-sm md:text-md font-medium text-gray-500">{cardTitle}</h3>
                                <p className="text-md md:text-2xl font-medium text-center">{value}</p>
                            </CustomCard>)
                        })}
                    </div>
                </div>
            </div>
            <CustomSeparator withText={false}/>
            <h1 className = "text-2xl md:text-4xl font-bold">All Matches</h1>
            <div>

            </div>
        </div>
    );
}