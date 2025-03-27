import { CustomImage } from '@/components/custom/custom-image';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { getRealTeamLogoById } from '@/utils/real-team-logos';

type TeamCardProps = {
  team?: CompetitionsCollectionTeamsProps;
  hideLogo?: boolean;
};

export const TeamCard = ({ team, hideLogo }: TeamCardProps) => {
  return (
    team && (
      <div className="flex flex-row gap-8 justify-start items-center my-2">
        {!hideLogo && (
          <CustomImage
            forceSrc={getRealTeamLogoById(team.logoId)?.src}
            className="h-24 w-24"
          />
        )}
        <div className="flex flex-col gap-2 justify-start items-center">
          {[
            { label: 'Name', value: team.name },
            { label: 'Coach', value: team.coach },
            { label: 'Position', value: 'TODO' },
          ].map((team, i) => (
            <div key={i} className="flex w-full gap-2">
              <p className="font-semibold text-gray-400 w-max">{team.label}:</p>
              <p className="font-semibold text-gray-900 line-clamp-1">
                {team.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
