import { CustomButton } from "@/components/custom/custom-button";
import { CustomSeparator } from "@/components/custom/custom-separator";

export const LiveMatch = () => {
    return (
        <div>
            <div id="currentLiveMatch">
                <div className="flex flex-row justify-around items-center">
                    <h1 className="font-bold text-4xl text-main">Current Live Match</h1>
                    <CustomButton label="Refresh match" />
                </div>
            </div>
            <CustomSeparator withText={false} />
            <div id="upcomingMatches">
                <h1 className="font-bold text-4xl text-main">Upcoming Matches</h1>
            </div>
        </div>
    );
}