import { TeamCard } from './team-card';
import { useGetTeams } from '@/data/teams/use-get-teams';

export const YourTeam = () => {
  const { getTeam } = useGetTeams();
  const currentTeam = getTeam();

  return (
    <div className="self-start">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Your Team</h1>
      <TeamCard team={currentTeam} />
    </div>
  );
};
