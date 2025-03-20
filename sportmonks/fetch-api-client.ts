// Here we are mapping the folders and files from the "pages/api/sportmonks" folder
const API_DATA = {
  'PLAYERS/GET-ALL': 'players/get-all',
  'PLAYERS/GET-BY-ID': 'players/get-by-id',
};

// This is meant to be used throught the project, client side (so everywhere BUT on the "pages/api" folder), because the SportMonks uses secret data in the query params and we have to hide from the client, so that's why we are leveraging the server to fetch it and return the desired data here
export const fetchSportmonksApiClient = async <QueryParameters>(
  path: keyof typeof API_DATA,
  queryParams?: QueryParameters,
) => {
  const baseUrl = '/api/sportmonks';
  const urlPath = API_DATA[path];

  const _queryParameters = queryParams
    ? Object.entries(queryParams as any)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    : '';
  const queryParameters = _queryParameters ? `&${_queryParameters}` : '';

  const url = `${baseUrl}/${urlPath}${queryParameters}`;
  return await fetch(url).then((response) => response.json());
};
