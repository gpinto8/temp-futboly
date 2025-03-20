import {
  DATA,
  DataPath,
  mapQueryParameters,
} from '@/sportmonks/fetch-sportmonks-api';
import type { NextApiRequest, NextApiResponse } from 'next';

// DO NOT USE THIS API, USE THE "fetch-sportmonks-api.ts" util
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apiToken = process.env.SPORTMONKS_API_KEY;
  const path = req.query?.path as DataPath;
  const additionalPath = req.query?.additionalPath as string;
  const page = req.query?.page as string;
  const includes = req.query.includes as string;

  let newPath = path;
  if (additionalPath) newPath += `/${additionalPath}`;

  const _includeQueryParams = includes.split(',').join(';');
  const includeQueryParams = _includeQueryParams || '';

  const queryParameters = mapQueryParameters({
    api_token: apiToken,
    page,
    includes: includeQueryParams,
  });

  const url = `${DATA.URL}/${newPath}${queryParameters}`;
  const data = await fetch(url).then((response) => response.json());
  res.status(200).json(data);
};
