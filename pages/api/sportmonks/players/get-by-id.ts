import { fetchSportmonksApiServer } from '@/sportmonks/fetch-api-server';
import type { NextApiRequest, NextApiResponse } from 'next';

export type PlayersGetIdQueryParamProps = {
  id?: number;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id }: PlayersGetIdQueryParamProps = req.query;

  const data = await fetchSportmonksApiServer(
    { path: 'PLAYERS/GET_BY_ID', id },
    undefined,
    ['POSITION', 'DETAILED_POSITION', 'TEAMS.TEAM', 'STATISTICS.DETAIL'],
  );

  res.status(200).json(data);
};
