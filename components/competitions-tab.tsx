import { IMG_URLS } from '@/utils/img-urls';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from './custom/custom-button';
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { updateFirestoreRedux } from '@/utils/update-firestore-redux';

export const CompetitionsTab = () => {
  const { setLeague } = updateFirestoreRedux();
  const league = useAppSelector(state => state.league);

  const handleCompetitionSelection = async (id: number) => {
    const mergedCompetitions = league?.competitions.map(competition => ({
      ...competition,
      active: !!(competition.id === id),
    }));
    setLeague({ competitions: mergedCompetitions });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
      {league?.competitions?.map((competition, index) => {
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
