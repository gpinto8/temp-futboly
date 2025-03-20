export const DATA = {
  URL: 'https://api.sportmonks.com/v3',
  PATHS: ['football/players'],
  INCLUDES: [
    'teams',
    'teams.team',
    'position',
    'detailedPosition',
    'statistics',
    'statistics.details',
  ],
} as const;

export type DataPath = (typeof DATA.PATHS)[number];
export type DataIncludes = (typeof DATA.INCLUDES)[number][];
export type ResponseData = {
  data: any;
  rate_limit: any;
  subscription: any;
  timezone: any;
};

const DEFAULT_INCLUDES: { [key in DataPath]: DataIncludes } = {
  'football/players': [
    'position',
    'detailedPosition',
    'teams.team',
    'statistics.details',
  ],
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
) => {
  const baseUrl = '/api/sportmonks';
  const newPage = page || 1;
  const allIncludes = DEFAULT_INCLUDES['football/players'] || [];
  if (includes) allIncludes.concat(includes);

  const queryParameters = mapQueryParameters({
    path,
    additionalPath,
    page: newPage,
    includes: allIncludes,
  });

  const url = `${baseUrl}${queryParameters}`;
  const data = await fetch(url).then((response) => response.json());
  return data as ResponseData;
};
