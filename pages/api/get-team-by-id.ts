import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const queryParameters = req.query;

  const data = await fetch(
    `https://api.sportmonks.com/v3/football/teams/${queryParameters.teamId}?api_token=9QudD8bREVydDeSDCCkPHerTQ3TrzmbP0YCOJqTmc0C37eLwRFVYSx7SExnA`
  ).then(response => response.json());

  res.status(200).json(data);
}
