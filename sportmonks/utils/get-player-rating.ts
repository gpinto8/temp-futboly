export const getPlayerRating = (playerStatistics: any) => {
  const rating = playerStatistics // From the statistics
    ?.reverse() // Reverse the array since the last ones are the recent ones
    ?.map((stat: any) => stat.details.find((detail: any) => detail.type_id === 118)) // Get the rating statistics type (which is "118")
    ?.filter(Boolean) // Filter out the empty ones
    ?.map((stat: any) => stat.value.average && stat.value.average)
    ?.at(-1); // Get the latest one

  return rating;
};
