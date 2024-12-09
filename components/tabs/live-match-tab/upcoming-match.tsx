import { CustomCard } from "@/components/custom/custom-card";
import { CustomImage } from "@/components/custom/custom-image";

export const UpcomingMatch = () => {
    return (
        <CustomCard style="gray">
            <div className="text-center ">
                <div className="flex flex-row gap-4">
                    <CustomImage
                    forceSrc="https://cdn.sportmonks.com/images/soccer/teams/30/62.png"
                    className="h-12 lg:h-16 w-12 lg:w-16"
                    width={32}
                    height={32}
                    />
                    <CustomImage
                    forceSrc="https://cdn.sportmonks.com/images/soccer/teams/30/62.png"
                    className="h-12 lg:h-16 w-12 lg:w-16"
                    width={32}
                    height={32}
                    />
                </div>
                <p className="font-semibold">Team 1</p>
                <p className="font-semibold">vs</p>
                <p className="font-semibold">Team 2</p>
            </div>
        </CustomCard>
    );
}