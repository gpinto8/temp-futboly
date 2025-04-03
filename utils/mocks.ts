import {
  MatchTeamType,
  PlayerType,
} from '@/components/tabs/live-match-tab/live-match-section';

export const getMockupFormation = () => {
  return {
    teamName: 'Portugal',
    teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
    module: '4-4-2',
    players: [
      {
        name: 'Cristiano Ronaldo',
        image: 'https://cdn.sportmonks.com/images/soccer/players/7/7.png',
        position: 'FW',
        shirtNumber: 7,
        points: 0,
        isCaptain: true,
      } as PlayerType,
      {
        name: 'Joao Felix',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Bruno Fernandes',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'MF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Ruben Dias',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
    ],
    bench: [
      {
        name: 'Rui Patricio',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'GK',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Pepe',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'DF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Danilo Pereira',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'MF',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Diogo Jota',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Diogo Jota',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Diogo Jota',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Diogo Jota',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Diogo Jota',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
      {
        name: 'Diogo Jota',
        image: 'https://cdn.sportmonks.com/images/soccer/players/1/1.png',
        position: 'FW',
        shirtNumber: 1,
        points: 0,
        isCaptain: false,
      } as PlayerType,
    ],
  } as MatchTeamType;
};

export const getMockupMatchesHistory = () => {
  return [
    {
      home: {
        teamName: 'Portugal',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      away: {
        teamName: 'France',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      date: new Date(Date.parse('2024-09-01')),
      status: 'Ended',
      score: {
        home: 2,
        away: 1,
      },
    },
    {
      home: {
        teamName: 'Portugal',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      away: {
        teamName: 'France',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      date: new Date(Date.parse('2024-09-05')),
      status: 'Upcoming',
    },
    {
      home: {
        teamName: 'Portugal',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      away: {
        teamName: 'France',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      date: new Date(Date.parse('2024-09-10')),
      status: 'Ended',
      score: {
        home: 2,
        away: 1,
      },
    },
    {
      home: {
        teamName: 'Portugal',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      away: {
        teamName: 'France',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      date: new Date(Date.parse('2024-10-01')),
      status: 'Ended',
      score: {
        home: 2,
        away: 1,
      },
    },
    {
      home: {
        teamName: 'Portugal',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      away: {
        teamName: 'France',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      date: new Date(Date.parse('2024-10-05')),
      status: 'Ended',
      score: {
        home: 2,
        away: 1,
      },
    },
    {
      home: {
        teamName: 'Portugal',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      away: {
        teamName: 'France',
        teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/30/62.png',
      },
      date: new Date(Date.now()),
      status: 'Upcoming',
    },
  ] as MatchInfoType[];
};

type MinimalMatchTeamType = Pick<MatchTeamType, 'teamName' | 'teamLogo'>;

type MatchInfoType = {
  home: MinimalMatchTeamType;
  away: MinimalMatchTeamType;
  date: Date;
  status: 'Upcoming' | 'Ended';
  score?: {
    home: number;
    away: number;
  };
};

export const getMockupAllMatchesHistory = () => {
  return [
    {
      week: 1,
      matches: getMockupMatchesHistory().slice(0, 5),
    },
    {
      week: 2,
      matches: getMockupMatchesHistory().slice(0, 5),
    },
    {
      week: 3,
      matches: getMockupMatchesHistory().slice(0, 5),
    },
    {
      week: 4,
      matches: getMockupMatchesHistory().slice(0, 5),
    },
  ] as WeeklyMatchInfoType[];
};

type WeeklyMatchInfoType = {
  week: number;
  matches: MatchInfoType[];
};
