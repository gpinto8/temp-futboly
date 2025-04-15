'use client';

import Chip from '@mui/material/Chip';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomCard } from '@/components/custom/custom-card';
import { useEffect, useState } from 'react';
import { CustomImage } from './custom/custom-image';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useGetTeams } from '@/data/teams/use-get-teams';
import { getRealTeamLogoById, RealTeamLogoIds } from '@/utils/real-team-logos';
import { useGetMatches } from '@/data/matches/use-get-matches';
import { useAppSelector } from '@/store/hooks';
import { useTabContext } from '@/utils/tab-context';
import { getSportmonksPlayersDataByIds } from '@/sportmonks/common-methods';

type BannerCardProps = {
  title: string;
  logoId?: RealTeamLogoIds;
  entries: {
    key: string;
    value?: string | number;
  }[];
};

const BannerCard = ({ title, logoId, entries }: BannerCardProps) => {
  const realTeamLogosData = getRealTeamLogoById(logoId);

  return (
    <CustomCard
      style="light"
      hoverable
      className="deep-faded-shadow-around w-full p-4 md:p-4 lg:p-4 xl:!p-4 flex flex-col gap-4"
    >
      <div className="flex justify-between gap-2 items-center">
        <h3 className="w-full line-clamp-1 text-nowrap text-xl md:text-2xl font-semibold">
          {title}
        </h3>

        <CustomImage
          className="rounded-full border object-cover shadow-md w-7 h-7 lg:w-10 lg:h-10"
          {...(realTeamLogosData
            ? {
                forceSrc: realTeamLogosData.src,
                forcedAlt: realTeamLogosData.alt,
              }
            : { imageKey: 'AT_ICON' })}
        />
      </div>

      <div className="flex flex-col gap-1 h-full">
        {entries && Object.values(entries)?.some((entry) => entry.value) ? (
          entries.map(({ key, value }, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-pretty text-sm text-gray font-semibold">
                {key}:{' '}
              </span>
              <span className="text-pretty text-sm font-bold max-w-[50ch] overflow-hidden">
                {value}
              </span>
            </div>
          ))
        ) : (
          <div className="h-20 flex justify-center items-center">No data</div>
        )}
      </div>
    </CustomCard>
  );
};

const GameSection = () => {
  const { getTimeToNextMatch, getNextMatch, getNextMatchRatings } =
    useGetMatches();
  const activeCompetition = useAppSelector(
    (state) => state.competition.activeCompetition,
  );
  const competitionStarted = activeCompetition?.competitionStarted;

  const [timeLeftToNextMatch, setTimeLeftToNextMatch] = useState(
    getTimeToNextMatch(),
  );
  const [nextMatchFound, setNextMatchFound] = useState(false);

  const [nextMatchMapped, setNextMatchMapped] = useState<any>(null);
  const [nextMatchWithRating, setNextMatchWithRating] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setNextMatchFound(false);
      setNextMatchMapped(null);
      setNextMatchWithRating(null);
      const nextMatch = getNextMatch();
      if (!nextMatch || nextMatch === -1) return;
      setNextMatchFound(true);
      const homePlayerIds = nextMatch.home.players.map(
        (player: any) => player.sportmonksId,
      );
      const awayPlayerIds = nextMatch.away.players.map(
        (player: any) => player.sportmonksId,
      );
      const homeReturnAPIData = await getSportmonksPlayersDataByIds(
        homePlayerIds,
      );
      const awayReturnAPIData = await getSportmonksPlayersDataByIds(
        awayPlayerIds,
      );
      if (!homeReturnAPIData && !awayReturnAPIData) return;
      const tempNextMatch = {
        ...nextMatch,
        home: {
          ...nextMatch.home,
          players: homeReturnAPIData,
        },
        away: {
          ...nextMatch.away,
          players: awayReturnAPIData,
        },
      };
      setNextMatchMapped(tempNextMatch);
      const timeLeftToNextMatch = getTimeToNextMatch();
      if (timeLeftToNextMatch < 1) {
        //Match started
        const nextMatchWithRatingRes = await getNextMatchRatings(
          homeReturnAPIData,
          awayReturnAPIData,
        );
        setNextMatchWithRating(nextMatchWithRatingRes);
      }
    })();
  }, [activeCompetition]);

  return competitionStarted ? (
    nextMatchFound && nextMatchWithRating ? (
      <GameSectionCard isLive={true} nextMatch={nextMatchWithRating} />
    ) : (
      nextMatchMapped && (
        <GameSectionCard isLive={false} nextMatch={nextMatchMapped} />
      )
    )
  ) : null;
};

const GameSectionCard = ({
  nextMatch,
  isLive,
}: {
  nextMatch: any;
  isLive: Boolean;
}) => {
  const user = useAppSelector((state) => state.user);
  const homeTeamLogo = getRealTeamLogoById(nextMatch?.home?.logoId);
  const awayTeamLogo = getRealTeamLogoById(nextMatch?.away?.logoId);
  const homeClass = nextMatch?.home?.userRef?.id === user.id ? 'text-main' : '';
  const awayClass = nextMatch?.away?.userRef?.id === user.id ? 'text-main' : '';
  return (
    <div className="w-full sm:w-0 rounded-xl p-4 shadow-xl sm:min-w-[400px] md:w-[40%] xl:min-w-[400px]">
      <div id="gameInfo" className="flex flex-row justify-between my-6">
        {isLive && (
          <Chip className="animate-pulse" label="LIVE" color="error" />
        )}
        <span className="text-pretty text-gray font-medium ml-auto">
          Week {nextMatch.week}
        </span>
      </div>
      <div
        id="gameLiveResults"
        className="mt-8 mb-4 flex flex-row justify-around"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <CustomImage
            forceSrc={homeTeamLogo?.src}
            forcedAlt={homeTeamLogo?.alt}
            className="h-12 lg:h-16 w-12 lg:w-16"
            width={32}
            height={32}
          />
          <span className={homeClass + ' text-center'}>
            {nextMatch.home.name}
          </span>
        </div>
        <div className="text-center mx-4">
          {isLive ? (
            <div className="text-l md:text-xl font-semibold text-nowrap">
              {nextMatch.result.home} - {nextMatch.result.away}
            </div>
          ) : (
            <div className="text-xl md:text-2xl font-bold text-nowrap">VS</div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <CustomImage
            forceSrc={awayTeamLogo?.src}
            forcedAlt={awayTeamLogo?.alt}
            className="h-12 lg:h-16 w-12 lg:w-16"
            width={32}
            height={32}
          />
          <span className={awayClass + ' text-center'}>
            {nextMatch.away.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OverviewBanner = () => {
  const { getLeague } = useGetLeagues();
  const { getTeam } = useGetTeams();
  const { getActiveCompetition } = useGetCompetitions();

  const [overviewLeague, setOverviewLeague] = useState<BannerCardProps>();
  const [overviewCompetition, setOverviewCompetition] =
    useState<BannerCardProps>();
  const [overviewTeam, setOverviewTeam] = useState<BannerCardProps>();

  // LEAGUE
  const league = getLeague();
  useEffect(() => {
    const data: BannerCardProps = {
      title: 'League',
      logoId: undefined,
      entries: [
        { key: 'Name', value: league?.name },
        { key: 'Owner', value: league?.ownerUsername },
        { key: 'Competitions', value: league?.competitionsNo },
      ],
    };
    setOverviewLeague(data);
  }, [league]);

  // COMPETITION
  const competition = getActiveCompetition();
  useEffect(() => {
    const data: BannerCardProps = {
      title: 'Competition',
      logoId: undefined,
      entries: [
        { key: 'Name', value: competition?.name },
        { key: 'Week', value: competition?.currentWeek },
        { key: 'Teams', value: competition?.players?.length },
      ],
    };
    setOverviewCompetition(data);
  }, [competition]);

  // TEAM DATA
  const team = getTeam();
  useEffect(() => {
    const data: BannerCardProps = {
      title: 'Team',
      logoId: team?.logoId,
      entries: [
        { key: 'Name', value: team?.name || '' },
        { key: 'Coach', value: team?.coach || '' },
        { key: 'Formation', value: team?.formation || '' },
      ],
    };
    setOverviewTeam(data);
  }, [team]);

  return (
    <div className="flex flex-col gap-4 justify-between items-center border border-gray rounded-lg shadow-xl p-4 px-8">
      {/* TITLE */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold leading-tight text-center text-main mb-2">
          Overview
        </h1>
      </div>

      {/* CARDS */}
      <div className="w-full flex flex-col gap-10">
        <div className="flex flex-col xl:flex-row gap-4 2xl:gap-12 items-center">
          <div className="w-full flex flex-row flex-wrap sm:flex-nowrap justify-center items-center gap-2 md 2xl:gap-6">
            {[overviewLeague!, overviewCompetition!, overviewTeam!]?.map(
              (data, index) => (
                <BannerCard key={index} {...data} />
              ),
            )}
          </div>
          <GameSection />
        </div>
      </div>
      <TimerSection />
    </div>
  );
};

const TimerSection = () => {
  const competition = useAppSelector(
    (state) => state.competition.activeCompetition,
  );
  const { getTimeToNextMatch } = useGetMatches();
  const [timeLeftToNextMatch, setTimeLeftToNextMatch] = useState<number>(
    getTimeToNextMatch(),
  );
  const { setCurrentTab } = useTabContext();

  // Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (timeLeftToNextMatch > 0) {
      timerId = setInterval(() => {
        setTimeLeftToNextMatch((prev) => prev - 1000);
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full flex justify-around flex-wrap sm:justify-center items-center gap-2 mt-2">
      {competition?.competitionStarted ? (
        timeLeftToNextMatch > 0 ? (
          <div className="flex flex-wrap justify-center">
            <h3 className="text-center sm:text-left text-lg text-nowrap font-bold text-error sm:text-xl mx-2">
              {formatDateDiffToDate(timeLeftToNextMatch)}
            </h3>
            <h3 className="text-center sm:text-left text-lg text-nowrap font-bold text-gray-900 sm:text-xl">
              to the next game!
            </h3>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center">
            <h3 className="text-center sm:text-left text-lg text-nowrap font-bold text-error sm:text-xl mx-2">
              Game is in progress!
            </h3>
          </div>
        )
      ) : null}
      {timeLeftToNextMatch > 0 && (
        <CustomButton
          label={timeLeftToNextMatch > 0 ? 'Insert Lineups' : 'Check Match'}
          style={timeLeftToNextMatch > 0 ? 'outlineMain' : 'main'}
          handleClick={() =>
            setCurrentTab(timeLeftToNextMatch > 0 ? 'Teams' : 'Live Match')
          }
          className="rounded-full mt-3"
          disableElevation
        />
      )}
    </div>
  );
};
function formatDateDiffToDate(millisecDiff: number) {
  if (millisecDiff <= 0) return 'Game is in progress!';

  const totalSeconds = Math.floor(millisecDiff / 1000);

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    days > 0 ? `${days}d` : '',
    hours > 0 ? `${hours}h` : '',
    minutes > 0 ? `${minutes}m` : '',
    seconds > 0 ? `${seconds}s` : '',
  ].filter(Boolean); // Remove empty ones

  return parts.join(' ').trim(); // Union with white spaces
}
