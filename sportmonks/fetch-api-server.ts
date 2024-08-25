// Here we are mapping the data from the Sportmonks API
const SPORTMONKS_DATA = {
  URL: 'https://api.sportmonks.com/v3',
  APIS: {
    'PLAYERS/GET_ALL': 'football/players',
    'PLAYERS/GET_BY_ID': 'football/players',
  },
  INCLUDES: {
    'TEAMS': 'teams',
    'TEAMS.TEAM': 'teams.team',
    'POSITION': 'position',
    'DETAILED_POSITION': 'detailedPosition',
    'STATISTICS': 'statistics',
    'STATISTICS.DETAIL': 'statistics.details',
  },
};

// This is meant to be used on the "pages/api" folder to build the apis to Sportmonks
export const fetchSportmonksApiServer = async (
  { path, id }: { path: keyof (typeof SPORTMONKS_DATA)['APIS']; id?: number },
  page?: number,
  includes?: (keyof (typeof SPORTMONKS_DATA)['INCLUDES'])[]
) => {
  let pathUrl = SPORTMONKS_DATA.APIS[path];
  if (id) pathUrl += `/${id}`;

  const apiKey = '9QudD8bREVydDeSDCCkPHerTQ3TrzmbP0YCOJqTmc0C37eLwRFVYSx7SExnA'; // TODO: TO REMOVE
  const currentPage = page || 1;
  const includeQueryParams = includes?.map(include => SPORTMONKS_DATA.INCLUDES[include]).join(';');

  const url = `${SPORTMONKS_DATA.URL}/${pathUrl}?api_token=${apiKey}&page=${currentPage}&include=${includeQueryParams}`;
  return await fetch(url).then(response => response.json());
};
