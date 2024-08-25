'use client';

import { useAppSelector } from '@/store/hooks';

export const OverviewBanner = () => {
  const league = useAppSelector(state => state.league);

  return (
    <div className="border border-error h-[200px] flex flex-col gap-4 justify-center items-center">
      <div className="">OVERVIEW BANNER</div>
      <div>LEAGUE: {league?.name}</div>
      <div>COMPETITION: {league?.competitions?.find(competition => competition.active)?.name}</div>
    </div>
  );
};
