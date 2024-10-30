'use client';

import { useAppSelector } from '@/store/hooks';
import Chip from '@mui/material/Chip';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomCard } from '@/components/custom/custom-card';
import { use, useEffect, useState } from 'react';
import { CustomImage } from './custom/custom-image';
import { ImageUrlsProps } from '@/utils/img-urls';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { LeaguesCollectionProps, MappedLeaguesProps, UsersCollectionProps } from '@/firebase/db-types';

type BannerCardProps = {
  title: string;
  imageKey: ImageUrlsProps;
  entries: {
    key: string;
    value?: string | number;
  }[];
};

const BannerCard = ({ title, imageKey, entries }: BannerCardProps) => {
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
          imageKey={imageKey}
        />
      </div>

      <div className="flex flex-col gap-1">
        {entries.map(({ key, value }, index) => (
          <div key={index} className="line-clamp-1">
            <span className="text-pretty text-sm text-gray font-semibold">
              {key}:{' '}
            </span>
            <span className="text-pretty text-sm font-bold">{value}</span>
          </div>
        ))}
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
  const { user, league }: {user: UsersCollectionProps | undefined, league: LeaguesCollectionProps | MappedLeaguesProps | undefined} = useAppSelector((state) => {return { "user": state.user, "league": state.league }});
  const [overviewData, setOverviewData] = useState<BannerCardProps[]>([]);
  const { getLeague } = useGetLeagues();
  const { getActiveCompetitionByUid } = useGetCompetitions(); //TODO: substitute with hook that takes it from redux

  useEffect(() => {
    const updateBanners = async () => {
      if (!user || !league) return;
      const activeCompetition = await getActiveCompetitionByUid(league.id, user); //getActiveCompetition();
      const currentLeague = await getLeague();

      const leagueData: BannerCardProps = {
        title: 'League',
        imageKey: 'AT_ICON',
        entries: [
          { key: 'Name', value: currentLeague?.name },
          { key: 'Owner', value: currentLeague?.ownerUsername },
          { key: 'Competition', value: currentLeague?.competitionsNo },
        ],
      };

      const competitionData: BannerCardProps = {
        title: 'Competition',
        imageKey: 'AT_ICON',
        entries: [
          { key: 'Name', value: activeCompetition?.name },
          { key: 'Week', value: activeCompetition?.currentWeek ? Number(activeCompetition.currentWeek) : undefined },
          { key: 'Teams', value: activeCompetition?.players.length },
        ],
      };

      const teamData: BannerCardProps = {
        title: 'Team',
        imageKey: 'AT_ICON',
        entries: [
          { key: 'Name', value: 'TODO' },
          { key: 'Coach', value: 'TODO' },
          { key: 'Position', value: 'TODO' },
        ],
      };

      setOverviewData([leagueData, competitionData, teamData]);
    };
    if (user && user.id && String(user.id).trim() !== "" && league && league.id && String(league.id).trim() !== "") {
      updateBanners();
    }
  }, [league]);

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
            {overviewData?.map((data, index) => (
              <BannerCard key={index} {...data} />
            ))}
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
