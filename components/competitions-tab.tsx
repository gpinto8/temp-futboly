import { IMG_URLS } from '@/utils/img-urls';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from './custom/custom-button';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CompetitionsCollectionProps } from '@/firebase/firestore/types';
import {
  getFirestoreCompetition,
  getFirestoreLeagues,
  getFirestoreUsers,
} from '@/firebase/firestore/get-methods';

export const CompetitionsTab = () => {
  const [competitions, setCompetitions] = useState<CompetitionsCollectionProps[]>([]);

  const user = useAppSelector(state => state.user);
  useEffect(() => {
    (async () => {
      if (user.uid) {
        const userData = await getFirestoreUsers(user.uid);
        const leagues = userData?.leagues?.map((league: any) => league.id);
        const activeLeagueId = leagues?.[0]; // to change once we get to the header

        const leaguesData = await getFirestoreLeagues(activeLeagueId);
        const competitions = leaguesData?.competitions?.map((competition: any) => competition.id);

        let competitionsData: CompetitionsCollectionProps[] = [];
        for await (const id of competitions!) {
          const data = await getFirestoreCompetition(id);
          if (data) competitionsData.push(data);
        }

        setCompetitions(competitionsData);
      }
    })();
  }, [user.uid]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
      {competitions.map((competition, index) => {
        const totalPlayers = competition.players.length + 1;
        const startDate = new Date(competition.startDate.toDate()).toLocaleDateString();
        const endDate = new Date(competition.endDate.toDate()).toLocaleDateString();
        const name = competition.name;

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
                <CustomButton className="mt-2" label="Select" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
