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
          { ... (realTeamLogosData ? { forceSrc: realTeamLogosData.src, forcedAlt: realTeamLogosData.alt } : {imageKey: "AT_ICON"}) }
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
  return (
    <div className="w-full sm:w-0 rounded-xl p-4 shadow-xl sm:min-w-[400px] md:w-[40%] xl:min-w-[400px]">
      <div id="gameInfo" className="flex flex-row justify-between my-6">
        <Chip className="animate-pulse" label="LIVE" color="error" />
        <span className="text-pretty text-gray font-medium">Week 31</span>
      </div>
      <div
        id="gameLiveResults"
        className="mt-8 mb-4 flex flex-row justify-around"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <CustomImage
            forceSrc="https://cdn.sportmonks.com/images/soccer/teams/30/62.png"
            className="h-12 lg:h-16 w-12 lg:w-16"
            width={32}
            height={32}
          />
          <span className="text-center">Team name</span>
        </div>
        <div className="text-center mx-4">
          <div className="text-l md:text-xl font-semibold text-nowrap">
            122 - 30
          </div>
          <div className="animate-pulse text-success text-opacity-70">85'</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <CustomImage
            forceSrc="https://cdn.sportmonks.com/images/soccer/teams/30/62.png"
            className="h-12 lg:h-16 w-12 lg:w-16"
            width={32}
            height={32}
          />
          <span className="text-center">Team name</span>
        </div>
      </div>
      <CustomButton
        label="Check Match"
        style="main"
        className="rounded-full mt-3"
        disableElevation
      />
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
        { key: 'Week', value: 'TODO' },
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
        { key: 'Position', value: 'TODO' },
      ],
    };
    setOverviewTeam(data);
  }, [team]);

  return (
    <div className='flex flex-col gap-4 justify-between items-center border border-gray rounded-lg shadow-xl p-4 px-8 dark:bg-gray-100 dark:text-gray-900"'>
      {/* TITLE */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold leading-tight text-center text-main mb-2">
          Overview
        </h1>
      </div>

      {/* CARDS */}
      <div className="w-full">
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

      {/* GAME */}
      <div className="w-full flex justify-around flex-wrap sm:justify-center items-center gap-2 mt-2">
        <div className="flex flex-wrap justify-center">
          <h3 className="text-center sm:text-left text-lg text-nowrap font-bold text-error sm:text-xl mx-2">
            1h 52m 15s
          </h3>
          <h3 className="text-center sm:text-left text-lg text-nowrap font-bold text-gray-900 sm:text-xl">
            to the next game!
          </h3>
        </div>
        <CustomButton
          label="Insert Lineups"
          style="outlineMain"
          className="font-semibold rounded-full !w-3/4 sm:!w-fit"
        />
      </div>
    </div>
  );
};
