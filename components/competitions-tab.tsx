import { IMG_URLS } from '@/utils/img-urls';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from './custom/custom-button';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LeagueCollectionCompetitionProps } from '@/firebase/firestore/types';
import { getFirestoreLeagues, getFirestoreUsers } from '@/firebase/firestore/get-methods';
import { getAppData, setAppData } from '@/data/get-app-data';

export const CompetitionsTab = () => {
  // const [competitions, setCompetitions] = useState<LeagueCollectionCompetitionProps[]>([]);
  const { setLeague } = setAppData();
  const { getLeague } = getAppData();

  // const user = useAppSelector(state => state.user);
  // useEffect(() => {
  //   (async () => {
  //     if (user.uid) {
  //       const userData = await getFirestoreUsers(user.uid);
  //       const leagues = userData?.leagues?.map((league: any) => league.id);
  //       const activeLeagueId = leagues?.[0]; // to change once we get to the header to change league

  //       const leaguesData = await getFirestoreLeagues(activeLeagueId);
  //       const competitions = leaguesData?.competitions;
  //       if (competitions) setCompetitions(competitions);
  //     }
  //   })();
  // }, [user.uid]);

  const handleCompetitionSelection = async (id: number) => {
    const mergedCompetitions = getLeague()?.competitions.map(competition => ({
      ...competition,
      active: !!(competition.id === id),
    }));
    setLeague({ competitions: mergedCompetitions });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
      {getLeague()?.competitions?.map((competition, index) => {
        const totalPlayers = competition.players.length + 1;
        const startDate = new Date(competition.startDate.toDate()).toLocaleDateString();
        const endDate = new Date(competition.endDate.toDate()).toLocaleDateString();
        const name = competition.name;
        const id = competition.id;

        return (
          <Card key={index + name} elevation={8} className="max-w-[300px] rounded-xl">
            <CardMedia
              className="h-40"
              image={IMG_URLS.LOGIN_ILLUSTRATION.src}
              title={IMG_URLS.LOGIN_ILLUSTRATION.alt}
            />
            <CardContent>
              <div className="flex flex-col gap-2 items-center">
                <div className="font-bold">{name}</div>
                <div>
                  {startDate} - {endDate}
                </div>
                <div>{totalPlayers} players</div>
                <CustomButton
                  className="mt-2"
                  label="Select"
                  handleClick={() => handleCompetitionSelection(id)}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
