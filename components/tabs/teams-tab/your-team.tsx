import { TeamCard } from './team-card';
import { useGetTeams } from '@/data/teams/use-get-teams';

export const YourTeam = () => {
  const { getTeam } = useGetTeams();
  const currentTeam = getTeam();

  return (
    <div className="self-start">
      {/* YOUR TEAM */}
      <div className="flex flex-col gap-12">
        <div className="w-full">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">Your Team</h1>
          <TeamCard team={currentTeam} />
        </div>
        {/* PLAYERS */}
        <div className="w-full">
          {currentTeam?.players?.map((player) => (
            <div>{player.sportmonksId}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
