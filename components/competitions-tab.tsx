// 'use client';

import { useEffect, useState } from 'react';
import { IMG_URLS } from '@/utils/img-urls';
import { Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from './custom/custom-button';
import React from 'react';

export const CompetitionsTab = () => {
  // await
  // sleep
  // const [asdf, se] = useState();

  useEffect(function () {
    console.log('first render');
    console.log('first render');
  }, []);

  // await new Promise(resolve => {
  //   return setTimeout(resolve, 2000);
  // });

  // useEffect(() => {
  // if (resetValue) {
  //   setValue('');
  //   setError(false);
  // }
  console.log('use effect');
  // }, [false]);

  const competitions = [
    {
      name: 'My Dummy Competition',
      date: '23/07/2024 - 12/31/2024',
      currentWeek: '4th week of 45',
      totalPlayers: '45 players',
    },
    {
      name: 'My Dummy Competition',
      date: '23/07/2024 - 12/31/2024',
      currentWeek: '4th week of 45',
      totalPlayers: '45 players',
    },
    {
      name: 'My Dummy Competition',
      date: '23/07/2024 - 12/31/2024',
      currentWeek: '4th week of 45',
      totalPlayers: '45 players',
    },
    {
      name: 'My Dummy Competition',
      date: '23/07/2024 - 12/31/2024',
      currentWeek: '4th week of 45',
      totalPlayers: '45 players',
    },
    {
      name: 'My Dummy Competition',
      date: '23/07/2024 - 12/31/2024',
      currentWeek: '4th week of 45',
      totalPlayers: '45 players',
    },
    {
      name: 'My Dummy Competition',
      date: '23/07/2024 - 12/31/2024',
      currentWeek: '4th week of 45',
      totalPlayers: '45 players',
    },
  ];

  // React.useEffect(() => {
  //   console.log('first render');
  //   console.log('first render');
  // }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {competitions.map(({ name, date, currentWeek, totalPlayers }) => (
        <Card sx={{ maxWidth: 345 }} elevation={8}>
          <CardMedia
            sx={{ height: 140 }}
            image={IMG_URLS.LOGIN_ILLUSTRATION.src}
            title="green iguana"
          />
          <CardContent>
            <div className="flex flex-col gap-2 items-center">
              <div className="font-bold">{name}</div>
              <div>{date}</div>
              <div>{currentWeek}</div>
              <div>{totalPlayers}</div>
            </div>
          </CardContent>
          <CardActions>
            <CustomButton label="Select" />
          </CardActions>
        </Card>
      ))}
    </div>
  );
};
