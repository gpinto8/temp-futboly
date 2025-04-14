import { fetchSportmonksApi } from './fetch-sportmonks-api';

export const getPlayerRating = (playerStatistics: any) => {
  const rating = playerStatistics // From the statistics
    ?.reverse() // Reverse the array since the last ones are the recent ones
    ?.map((stat: any) =>
      stat.details.find((detail: any) => detail.type_id === 118),
    ) // Get the rating statistics type (which is "118")
    ?.filter(Boolean) // Filter out the empty ones
    ?.map((stat: any) => stat.value.average && stat.value.average)
    ?.at(-1); // Get the latest one

  const displayedRating = rating && rating !== '0.00' && rating.toFixed(2);
  return displayedRating;
};

// Get Sportmonks players data based on an array of its ids asynchronously
export const getSportmonksPlayersDataByIds = async (playerIds: number[]) => {
  let playersData: any[] = [];

  for await (const playerId of playerIds) {
    const response = await fetchSportmonksApi(
      'football/players',
      `${playerId}`,
    );
    const data = response.data;
    if (data) playersData.push(data);
  }

  return playersData;
};
