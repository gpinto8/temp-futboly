'use client';

import { CustomImage } from "@/components/custom/custom-image";
import { CreateLeagueModal } from "@/components/modal/leagues-modal";
import { useBreakpoint } from "@/utils/use-breakpoint";
import { LeagueList } from "@/components/league-list";
import { CustomSeparator } from "@/components/custom/custom-separator";

const FirstTime = () => {
    return (
        <div className="mt-12 md:mt-4 min-w-full h-full"> 
            <div className="flex flex-row gap-4">
                <div className="flex flex-col justify-center items-start gap-2">
                    <h1 className="text-3xl font-bold">Create a League</h1>
                    <div className="flex flex-col gap-4 justify-center">
                        <p className="text-sm">Play with your friends with a <strong>private league</strong> or make new ones with a <strong>public league!</strong></p>
                        <CreateLeagueModal buttonFull={false} />
                    </div>
                    <CustomSeparator withText={true} text="OR" />
                    <h1 className="text-3xl font-bold">Join a League</h1>
                    <p>Choose one from the list below or join a league</p>
                </div>
                {useBreakpoint() !== "sm" && (
                    <div>
                        <CustomImage imageKey="LEAGUE_ILLUSTRATION" width={500} height={500} />
                    </div>
                )}
            </div>
            <LeagueList/>
        </div>
    );
}

export default FirstTime;