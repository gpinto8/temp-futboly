import { CustomSeparator } from '@/components/custom/custom-separator';
import { CustomImage } from '@/components/custom/custom-image';
import { MatchScheduleProps } from '@/firebase/db-types';
import { getCustomTeamLogoById } from '@/utils/real-team-logos';
import { useAppSelector } from '@/store/hooks';

type MappedMatchScheduleProps = MatchScheduleProps & {
  status: 'Upcoming' | 'Past';
};

export const WeeklyMatches = ({
  matches,
}: {
  matches: MappedMatchScheduleProps[];
}) => {
  const user = useAppSelector((state) => state.user);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-500">Date</p>
        <p className="font-semibold text-gray-500">Match</p>
        <p className="font-semibold text-gray-500">Result</p>
      </div>
      <CustomSeparator withText={false} />
      <div className="flex flex-col justify-between items-center gap-2">
        {matches.map((match: MappedMatchScheduleProps, index: number) => {
          if (match)
            return (
              <div
                key={index}
                className="w-full flex justify-between items-center"
              >
                <p className="font-semibold text-gray-900">
                  {new Date(match.date).toLocaleString().split(',')[0]}
                </p>
                <div className="flex justify-center items-center gap-4">
                  <div className="flex justify-center items-center gap-2">
                    <CustomImage
                      forceSrc={getCustomTeamLogoById(match.home.logoId)?.src}
                      className="h-8 w-8"
                    />
                    <p
                      className={
                        (match.home.userId === user.id ? 'text-main' : '') +
                        ' font-semibold text-gray-900'
                      }
                    >
                      {match.home.name}
                    </p>
                  </div>
                  {match.result ? (
                    <div className="flex justify-center items-center gap-2">
                      <p className="font-semibold text-gray-700">
                        {match.result.home}
                      </p>
                      <p className="font-semibold text-gray-700">-</p>
                      <p className="font-semibold text-gray-700">
                        {match.result.away}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold text-gray-900">vs</p>
                  )}
                  <div className="flex justify-center items-center gap-2">
                    <p
                      className={
                        (match.away.userId === user.id ? 'text-main' : '') +
                        ' font-semibold text-gray-900'
                      }
                    >
                      {match.away.name}
                    </p>
                    <CustomImage
                      forceSrc={getCustomTeamLogoById(match.away.logoId)?.src}
                      className="h-8 w-8"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{match.status}</p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};
