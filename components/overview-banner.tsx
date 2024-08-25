'use client';

import { getAppData } from '@/data/get-app-data';
import { getFirestoreLeagues, getFirestoreUsers } from '@/firebase/firestore/get-methods';
import {
  LeagueCollectionCompetitionProps,
  LeaguesCollectionProps,
} from '@/firebase/firestore/types';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

export const OverviewBanner = () => {
  // const { getLeague, getLeagueFetch } = getAppData();
  const league = useAppSelector(state => state.league);

  // const [league, setLeague] = useState();
  // const [activeCompetition, setActiveCompetition] = useState<LeagueCollectionCompetitionProps>();
  // const user = useAppSelector(state => state.user);
  // const _league = useAppSelector(state => state.league);
  // setLeague(_league as any);

  // console.log({ league });
  // const { fetchedLeague } = getAppData();
  // const data = getLeagueFetch();
  // console.log({ data });
  // useEffect(() => {
  //   (async () => {
  //     const asd = await getLeagueFetch();
  //     console.log({ asd });
  //     setLeague(asd as any);
  //   })();
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     console.log({ user });
  //     if (user.uid) {
  //       const userData = await getFirestoreUsers(user.uid);
  //       const leagues = userData?.leagues?.map((league: any) => league.id);
  //       const activeLeagueId = leagues?.[0]; // to change once we get to the header

  //       // const leaguesData = await getFirestoreLeagues(activeLeagueId);
  //       // setLeague(leaguesData);
  //       // setActiveCompetition(leaguesData?.competitions.find(competition => competition.active));
  //     }
  //   })();
  // }, [user]);

  return (
    <div className="border border-error h-[200px] flex flex-col gap-4 justify-center items-center">
      <div className="">OVERVIEW BANNER</div>
      <div>LEAGUE: {league?.name}</div>
      <div>COMPETITION: {league?.competitions?.find(competition => competition.active)?.name}</div>
    </div>
  );
};
