'use client';

import { useEffect, useState } from 'react';

const apiFootball = async (path: string, queryParams: string, season?: boolean) => {
  const SEASON = 2023;
  const seasonQuery = season ? `&season=${SEASON}&` : '';
  const url = `https://v3.football.api-sports.io/${path}?${seasonQuery}${queryParams}`;

  const data = await fetch(url, {
    'method': 'GET',
    'headers': {
      'x-apisports-key': process.env.NEXT_PUBLIC_API_FOOTBALL_KEY as any,
    },
    'mode': 'cors',
  }).then(response => response.json());
  return data;
};

const getPlayers = async () => {
  const league = 'IT';

  const serieA = await apiFootball('leagues', `code=${league}`, true).then(data => {
    const league = data?.response?.find((league: any) => league?.league?.name === 'Serie A');
    return league;
  });
  // console.log({ serieA });
  if (!serieA) return;

  const serieAId = serieA?.league?.id;
  const teams = await apiFootball('teams', `league=${serieAId}`, true);
  // console.log({ teams });
  if (!teams) return;

  const teamsIds = teams?.response?.map((team: any) => team?.team?.id);
  // console.log({ teamsIds });
  teamsIds.length = 1;

  let newTotalPlayers: any = [];
  const boh = await Promise.all(
    teamsIds.map(async (teamId: any) => {
      console.log({ teamId });
      const players = await apiFootball('players', `team=${teamId}`, true);
      // console.log({ teamId, players });
      const total = players.paging.total;
      // console.log({ total });

      // const totalPlayers = [...players.response];
      if (total > 1) {
        const totalPlayers = await Promise.all(
          Array.from({ length: total }).map(async (_, i) => {
            const newIndex = i + 1;
            if (newIndex === 1) return; // Because we've already fetched the first page

            // console.log({ newIndex });

            const players = await apiFootball('players', `team=${teamId}&page=${newIndex}`, true);
            // console.log({ players });
            return players.response;
          })
        );

        newTotalPlayers = await totalPlayers.concat(players.response).filter(Boolean).flat();
      }
      // console.log({ newTotalPlayers });

      return newTotalPlayers.flat();
      // const newTotalPlayers = totalPlayers.flat();
      // console.log({ newTotalPlayers, newTotalPlayersLength: newTotalPlayers.length });
    })
  );

  return boh[0];
};

export default function Home() {
  const [players, setPlayers] = useState();

  const handlePlayers = async () => {
    // console.log('hola');
    const allPlayers: any = await getPlayers();
    // console.log({ allPlayers });
    if (allPlayers) {
      setPlayers(allPlayers);
    }
  };

  useEffect(() => {
    console.log({ players });
  }, [players]);

  // const handlePlayers = async () => {
  //   const players = await getPlayers();
  // };

  return (
    <div>
      <h1>FUTBOLY</h1>
      <button onClick={async () => await handlePlayers()}>GET PLAYERS</button>
    </div>
  );
}
