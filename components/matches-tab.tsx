import { useEffect } from "react";
import { CustomCard } from "./custom/custom-card";
import { CustomSeparator } from "./custom/custom-separator";
import { PersonalMatch } from "@/components/tabs/matches-tab/personal-match";
import { getMockupMatchesHistory, getMockupAllMatchesHistory } from "@/utils/mocks";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CustomImage } from "./custom/custom-image";
import { WeeklyMatches } from "@/components/tabs/matches-tab/weekly-matches";

const statistics = [
    {title: "Total Wins", value: 0},
    {title: "Total Matches Played", value: 2},
    {title: "Overall Score", value: 89},
    {title: "Score This Week", value: 40}
];

const matchesHistory = getMockupMatchesHistory();
const allMatches = getMockupAllMatchesHistory();

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
            <h1 className="text-2xl md:text-4xl font-bold my-4">Your Matches</h1>
            <div>
                <div id="personalMatches" className="my-4 flex flex-col lg:grid lg:grid-cols-2">
                    <div id="personaleUpcomingMatches">
                        <h2 className="text-lg md:text-xl font-bold">Upcoming Matches</h2>
                        <div className="px-14 xl:px-24">
                            { matchesHistory.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0,3).map((match, index) => {return(
                                <PersonalMatch key={index} type="upcoming" matchInfo={match} className="my-2"/>
                            )})}
                        </div>
                    </div>
                    <div id="personalHistoryMatches">
                        <h2 className="text-lg md:text-xl font-bold">All Matches</h2>
                        <div className="px-14 xl:px-24 overflow-y-auto main-scrollbar">
                            { matchesHistory.sort((a, b) => a.date.getTime() - b.date.getTime()).map((match, index) => {return(
                                <PersonalMatch key={index} type="upcoming" matchInfo={match} className="my-2"/>
                            )})}
                        </div>
                    </div>
                </div>
                <div id="personalStatistics">
                    <h2 className="text-lg md:text-xl font-bold">Match Statistics</h2>
                    <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-center items-center">
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
            <h1 className = "text-2xl md:text-4xl font-bold my-2">All Matches</h1>
            <div className="border rounded-md shadow-lg">
                { allMatches.map((weeklyMatches, index) => (
                    <Accordion key={index}>
                        <AccordionSummary aria-controls={"panel"+index+"-content"} id={"panel"+index+"-header"} expandIcon={<CustomImage imageKey="EXPAND" className="h-5 w-5"/>} className="bg-lightGray">
                            <div className="w-full grid grid-cols-2">
                                <p className="font-semibold">Week {weeklyMatches.week}</p>
                                <p className="font-semibold">{weeklyMatches.matches[0].date.toLocaleString().split(",")[0]}</p>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <WeeklyMatches matches={weeklyMatches.matches} />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
}
