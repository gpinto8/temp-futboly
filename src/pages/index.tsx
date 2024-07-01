'use client';

import RootLayout from '@/app/layout';
import { useEffect, useState } from 'react';

const apiFootball = async (path: string, queryParams: string, season?: string) => {
  const SEASON = season;
  const seasonQuery = season ? `&season=${SEASON}` : '';
  const url = `https://v3.football.api-sports.io/${path}?${queryParams}${seasonQuery}`;

  const data = await fetch(url, {
    'method': 'GET',
    'headers': {
      'x-apisports-key': '8dd0a5d11a104b46b67907c925572de8',
    },
    'mode': 'cors',
  }).then(response => response.json());
  return data;
};

// const getPlayers = async () => {
//   const league = 'IT';

//   const serieA = await apiFootball('leagues', `code=${league}`, '2023').then(data => {
//     const league = data?.response?.find((league: any) => league?.league?.name === 'Serie A');
//     return league;
//   });
//   // console.log({ serieA });
//   if (!serieA) return;

//   const serieAId = serieA?.league?.id;
//   const teams = await apiFootball('teams', `league=${serieAId}`, '2023');
//   // console.log({ teams });
//   if (!teams) return;

//   const teamsIds = teams?.response?.map((team: any) => team?.team?.id);
//   // console.log({ teamsIds });
//   teamsIds.length = 1;

//   let newTotalPlayers: any = [];
//   const boh = await Promise.all(
//     teamsIds.map(async (teamId: any) => {
//       // console.log({ teamId });
//       const players = await apiFootball('players', `team=${teamId}`, '2023');
//       // console.log({ teamId, players });
//       const total = players.paging.total;
//       // console.log({ total });

//       // const totalPlayers = [...players.response];
//       if (total > 1) {
//         const totalPlayers = await Promise.all(
//           Array.from({ length: total }).map(async (_, i) => {
//             const newIndex = i + 1;
//             if (newIndex === 1) return; // Because we've already fetched the first page

//             // console.log({ newIndex });

//             const players = await apiFootball('players', `team=${teamId}&page=${newIndex}`, '2023');
//             // console.log({ players });
//             return players.response;
//           })
//         );

//         newTotalPlayers = await totalPlayers.concat(players.response).filter(Boolean).flat();
//       }
//       // console.log({ newTotalPlayers });

//       return newTotalPlayers.flat();
//       // const newTotalPlayers = totalPlayers.flat();
//       // console.log({ newTotalPlayers, newTotalPlayersLength: newTotalPlayers.length });
//     })
//   );

// TEST

//   return boh[0];
// };

const getAllPlayersByLeagueId = async (leagueId?: number, team?: string) => {
  const players = await apiFootball('players', `team=${team}`, '2024');
  // return players.response;
  // console.log({ players });
  const total = players.paging.total;

  let totalPlayers: any = players.response;
  if (total > 1) {
    totalPlayers = await Promise.all(
      Array.from({ length: total }).map(async (_, i) => {
        const newIndex = i + 1;
        if (newIndex === 1) return; // Because we've already fetched the first page

        const players = await apiFootball('players', `team=${team}&page=${newIndex}`, '2024');
        // console.log({ newIndex, players });
        // const players = await apiFootball('players', `league=${leagueId}&page=${newIndex}`, true);
        // sleep function to 1000ms
        // await new Promise(resolve => setTimeout(resolve, 1000));
        return players.response;
      })
    ).catch(err => console.log({ err }));

    totalPlayers = totalPlayers.concat(players.response).filter(Boolean).flat();
  }

  // console.log({ totalPlayers });
  return totalPlayers;
};

const Player: any = ({ player, theOther, setPlayer1, setPlayer2 }: any): any => {
  const [players, setPlayers] = useState<any>();
  const [fixtures, setFixtures] = useState<any>();

  const handlePlayers = async () => {
    // console.log('start');
    // const allPlayers: any = await getPlayers();
    // // console.log({ allPlayers });
    // if (allPlayers) {
    //   setPlayers(allPlayers);
    // }
    // const leagueId = 135;
    // const allPlayers = await getAllPlayersByLeagueId(leagueId);
    // console.log({ allPlayers });
    // allPlayers.length = 10;
    // if (allPlayers) {
    //   setPlayers(allPlayers);
    // }
    // console.log('end');

    // console.log({ asdf: fixtures.length });
    // Math.floor(Math.random() * 10)
    const random = Math.floor(Math.random() * fixtures.length);
    const teamId = theOther ? fixtures[random].teams.home.id : fixtures[random].teams.away.id;
    const fixtureId = fixtures[random].fixture.id;
    // console.log({ teamId, fixtureId });
    const allPlayers = await getAllPlayersByLeagueId(undefined, teamId);
    // console.log({ allPlayers });
    const playerStatistics = await apiFootball('fixtures/players', `fixture=${fixtureId}&team=${teamId}`);
    // console.log({ playerStatistics });
    // console.log({
    //   allPlayers,
    //   // playerStatistics2: playerStatistics,
    // });
    const ratings = playerStatistics?.response[0]?.players?.map((player: any) => ({
      id: player?.player?.id,
      rating: player?.statistics[0]?.games?.rating,
    }));
    // console.log({ playerStatistics, ratings });
    allPlayers.length = 11;
    if (allPlayers) {
      const withStatistics = allPlayers.map((player: any) => {
        return {
          ...player,
          id: player.player.id,
          // ratings,
          playerRating: ratings?.find((rating: any) => rating.id === player.player.id)?.rating,
          // ?.statistics[0].games.rating,
          // .find((stat: any) => stat.player.id === player.player.id)
          // ?.statistics[0].games.rating,
        };
      });
      // console.log({ withStatistics, name: player.name });
      if (withStatistics.length === 0) return;
      setPlayers(withStatistics);
      if (!theOther) {
        setPlayer1({ player1: [...withStatistics] });
      } else {
        setPlayer2({ player2: [...withStatistics] });
      }
    }
    // console.log('end');
  };

  const handleFixtures = async () => {
    const fixtures = await apiFootball('fixtures', 'live=all', '2024');
    // const asdf = fixtures.response.filter((fixture: any) => fixture.teams.away.id === 30);
    const euro = fixtures.response.filter((fixture: any) => fixture.league.name === 'Euro Championship');
    console.log({ fixtures, euro });
    // setFixtures(asdf);
    setFixtures((euro?.length && euro) || fixtures.response);
  };

  return (
    <>
      <div>TEAM LOGO: {<img src={player.logo} alt="bo" width={100} height={50} />}</div>
      <div>TEAM:</div>
      <div>TEAM NAME: {player.name}</div>
      <div>TEAM COACH: {player.coach}</div>
      <br />
      <br />
      <div>
        CURRENT FIXTURES:
        <button className="bg-red-500 border" onClick={async () => await handleFixtures()}>
          fetch or refresh
        </button>
      </div>
      {fixtures && (
        <div className="flex flex-col gap-10">
          {fixtures.map((fixture: any, index: number) => {
            return (
              <div key={fixture.fixture.id + Date.now()} className="flex gap-2">
                <div>{index}</div>
                <div>
                  {fixture.teams.home.name} <strong>vs</strong> {fixture.teams.away.name}
                </div>
                <div>-------- {fixture.fixture.status.elapsed} --------</div>
                <div>
                  <strong>FIXTURE: </strong> {fixture.fixture.id} | {new Date(fixture.fixture.date.toString()).toLocaleString().replaceAll('/', '-')}{' '}
                  | {fixture.fixture.status.long}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <br />
      <br />
      <div>
        TEAM PLAYERS:
        <button className="bg-red-500 border" onClick={async () => await handlePlayers()}>
          fetch or refresh
        </button>
      </div>
      {players && (
        <div className="flex flex-col gap-10">
          {players.map((player: any) => (
            <>
              <div key={player.player.id + Date.now()} className="flex gap-2">
                <img src={player.player.photo} alt={player.player.firstname} />
                <div>
                  <strong>PLAYER: </strong> {player.player.id} | {player.player.firstname} {player.player.lastname} | {player.player.age} |{' '}
                  {player.player.nationality}
                </div>
                <div> RATING: {player.playerRating}</div>
                <br />
                <br />
                <div>
                  <strong>TEAM: </strong> {player.statistics[0].team.id} | {player.statistics[0].team.name} |
                  <img src={player.statistics[0].team.logo} alt={player.player.firstname} width={20} height={10} />
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default function Home() {
  // useEffect(() => {
  //   console.log({ players });
  // }, [players]);

  // const handlePlayers = async () => {
  //   const players = await getPlayers();
  // };
  const [player1, setPlayer1] = useState<any>();
  const [player2, setPlayer2] = useState<any>();
  const [total, setTotal] = useState<any>();

  const FAKE_LEAGUE = 'LEGA FUTBOLY';
  const FAKE_TEAM = {
    name: 'PINTO TEAM',
    logo: 'https://cdn.shopify.com/s/files/1/1012/9648/files/6209928.jpg?5258471071695234298',
    coach: 'Giuseppe Pinto',
  };
  const FAKE_TEAM2 = {
    name: 'ENEMY TEAM',
    logo: 'https://media.istockphoto.com/id/164303473/it/vettoriale/il-cattivo.jpg?s=1024x1024&w=is&k=20&c=cykJVDMriFfcZf0GX5cqqVLkzJylxYLLofAZ93kOgb0=',
    coach: 'UNO CATTIVO',
  };

  useEffect(() => {
    // console.log({ leaderBoard });
    if (!player1 && !player2) return;

    // const playerOne = leaderBoard?.[0]?.[FAKE_TEAM.name]?.map((player: any) => player.playerRating);
    // const reducedPlayer1 = player1.reduce((a: any, b: any) => +a + +b, 0);
    // console.log({ reducedPlayer1 });
    // setPlayer1(reducedPlayer1);
    // const player2 = leaderBoard?.[1]?.[FAKE_TEAM2.name]?.map((player: any) => player.playerRating);
    // const reducedPlayer2 = player2.reduce((a: any, b: any) => +a + +b, 0);
    // setPlayer2(reducedPlayer2);
    // console.log({ reducedPlayer1, reducedPlayer2 });
    // console.log({ player1, player2 });

    const totalPlayer1 = player1?.player1?.map((a: any) => +a?.playerRating)?.filter(Boolean);
    const totalPlayer2 = player2?.player2?.map((a: any) => +a?.playerRating)?.filter(Boolean);

    setTotal({ totalPlayer1, totalPlayer2 });
  }, [player1, player2]);

  return (
    <RootLayout>
      <h1>FUTBOLY</h1>
      <br />
      <br />
      <div>LEAGUE: {FAKE_LEAGUE}</div>
      <br />
      <br />
      <div>CLASSIFICA: </div>
      <div>
        {FAKE_TEAM.name}: {total?.totalPlayer1?.reduce((a: any, b: any) => a + b, 0)} ({total?.totalPlayer1?.map((a: any) => a + ', ')})
      </div>
      <div>
        {FAKE_TEAM2.name}: {total?.totalPlayer2?.reduce((a: any, b: any) => a + b, 0)} ({total?.totalPlayer2?.map((a: any) => a + ', ')})
      </div>
      <br />
      <br />
      <Player player={FAKE_TEAM} theOther={false} setPlayer1={setPlayer1} setPlayer2={setPlayer2} />
      <hr />
      <Player player={FAKE_TEAM2} theOther={true} setPlayer1={setPlayer1} setPlayer2={setPlayer2} />
    </RootLayout>
  );
}
