export const DATA = {
  URL: 'https://api.sportmonks.com/v3',
  PATHS: ['football/players', 'football/fixtures/between', `football/players/search`],
  INCLUDES: [
    'teams',
    'teams.team',
    'position',
    'detailedPosition',
    'statistics',
    'statistics.details',
    'lineups',
    'lineups.details',
  ],
} as const;

export type DataPath = (typeof DATA.PATHS)[number];
export type DataIncludes = (typeof DATA.INCLUDES)[number][];

export type SportmonksResponseData = {
  data: any;
  rate_limit: any;
  subscription: any;
  timezone: any;
};

const DEFAULT_INCLUDES: { [key in DataPath | any]: DataIncludes } = {
  'football/players': [
    'position',
    'detailedPosition',
    'teams.team',
    'statistics.details',
  ],
  'football/fixtures/between': ['lineups.details'],
};

export const mapQueryParameters = (queryParametersMap: {
  [key: string]: any;
}) => {
  const _queryParameters = queryParametersMap
    ? Object.entries(queryParametersMap)
        .map(([key, value]) => value && `${key}=${value}`)
        .filter(Boolean)
        .join('&')
    : '';
  const queryParameters = _queryParameters ? `?${_queryParameters}` : '';
  return queryParameters;
};

export const fetchSportmonksApi = async (
  path: DataPath,
  additionalPath?: string,
  page?: number,
  includes?: DataIncludes,
  filters?: string,
) => {
  const baseUrl = '/api/sportmonks';
  const newPage = page || 1;
  const allIncludes = DEFAULT_INCLUDES[path] || [];
  if (includes) allIncludes.concat(includes);

  const queryParameters = mapQueryParameters({
    path,
    additionalPath,
    page: newPage,
    includes: allIncludes,
  });

  const url = `${baseUrl}${queryParameters}${filters ? '&' + filters : ''}`;
  const data = await fetch(url).then((response) => response.json());
  return data as SportmonksResponseData;
};
