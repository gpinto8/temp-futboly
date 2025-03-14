import { CustomImage } from '@/components/custom/custom-image';
import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { getRealTeamLogoById } from '@/utils/real-team-logos';

type TeamCardProps = {
  team?: CompetitionsCollectionTeamsProps;
};

export const TeamCard = ({ team }: TeamCardProps) => {
  return (
    team && (
      <div className="flex flex-row gap-8 justify-start items-center my-2">
        <CustomImage
          forceSrc={getRealTeamLogoById(team.logoId)?.src}
          className="h-24 w-24"
        />
        <div className="flex flex-col gap-2 justify-start items-center">
          {[
            { label: 'Name', value: team.name },
            { label: 'Coach', value: team.coach },
            { label: 'League Position', value: 'TODO' },
          ].map((team, i) => (
            <div key={i} className="flex w-full gap-2">
              <p className="font-semibold text-gray-400">{team.label}:</p>
              <p className="font-semibold text-gray-900">{team.value}</p>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
