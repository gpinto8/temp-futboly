import { /*useEffect,*/ useState } from "react";
import { CustomImage } from "@/components/custom/custom-image";
import { getMockupPersonalTeam, getMockupTeams } from "@/utils/mocks";
import { CustomSeparator } from "@/components/custom/custom-separator";
import { TeamRecap } from "@/components/tabs/teams-tab/team-recap";

const personalTeam = getMockupPersonalTeam();
const allTeams = getMockupTeams();

export const Teams = () => {
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [cardHeightClass, setCardHeightClass] = useState<string>("");

    // At the moment this doesn't work because if the card is not rendered, the height is unknown, so tailwind
    // When compiles the classes doesn't know the height of the card
    // useEffect(() => {
    //     const teamCard = document.getElementById("team-card-0");
    //     if (teamCard && !cardHeightClass) {
    //         setCardHeightClass(`h-[${teamCard.clientHeight}px]`);
    //     }
    // }, []);


    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <div className="self-start">
                <h1 className="text-2xl md:text-4xl font-bold my-4">Your Team</h1>
                <div className="flex flex-row gap-8 justify-start items-center my-2">
                    <CustomImage forceSrc={personalTeam.teamLogo} className="h-24 w-24" />
                    <div className="flex flex-col gap-2 justify-start items-center">
                        <div className="flex justify-center items-center gap-2">
                            <p className="font-semibold text-gray-400">Name:</p>
                            <p className="font-semibold text-gray-900">{personalTeam.teamName}</p>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <p className="font-semibold text-gray-400">Coach:</p>
                            <p className="font-semibold text-gray-900">{personalTeam.owner}</p>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <p className="font-semibold text-gray-400">League Position:</p>
                            <p className="font-semibold text-gray-900">{personalTeam.leaguePosition}</p>
                        </div>
                    </div>
                </div>
            </div>
            <CustomSeparator withText={false} />
            <div>
                <h1 className="text-2xl md:text-4xl font-bold my-4">All Teams</h1>
                <div className="grid grid-cols-3 gap-4 auto-rows-fr">
                    {allTeams.map((team, index) => (
                        <TeamRecap team={team} index={index} selectedTeamIndex={selectedTeam} setSelectedTeamIndex={setSelectedTeam} />
                    ))}
                </div>
            </div>
        </div>
    );
}