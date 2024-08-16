import { fetchSportmonksApiServer } from '@/sportmonks/fetch-api-server';
import type { NextApiRequest, NextApiResponse } from 'next';

export type PlayersGetAllQueryParamProps = {
  page?: number;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { page }: PlayersGetAllQueryParamProps = req.query;

  const data = await fetchSportmonksApiServer({ path: 'PLAYERS/GET_ALL' }, page, [
    'POSITION',
    'DETAILED_POSITION',
    'TEAMS.TEAM',
    'STATISTICS.DETAIL',
  ]);

  res.status(200).json(data);
};
