import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // console.log({ req, res });
  const { id } = req.query;
  // const data = await fetch('https://jsonplaceholder.typicode.com/todos/1').then(response =>
  //   response.json()
  // );

  const data = await fetch(
    `https://api.sportmonks.com/v3/football/players/${id}?api_token=9QudD8bREVydDeSDCCkPHerTQ3TrzmbP0YCOJqTmc0C37eLwRFVYSx7SExnA`,
    {
      // mode: 'no-cors',
      // cache: 'no-store',
      // next: { revalidate: 3600 },
    }
  ).then(response => response.json());

  // const data2 = await fetch(data.pagination.next_page, {
  //   // mode: 'no-cors',
  //   // cache: 'no-store',
  //   // next: { revalidate: 3600 },
  // }).then(response => response.json());

  res.status(200).json(data);
  // res.status(200).json(data2);
}
