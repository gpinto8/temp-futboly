import { fetchSportmonksApi } from './fetch-sportmonks-api';

export type DateString = `${number}-${number}-${number}`; // This is the sportmonks way to get it

const isValidDateString = (date: string): date is DateString => {
  return /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(date);
};

// (Fetchs also futures dates btw)
// (Both dates are included btw)
export const fetchSportmonksFootballFixtureBetween = async (
  startDate: DateString,
  endDate: DateString,
  teamId: number,
) => {
  if (isValidDateString(startDate) && isValidDateString(endDate) && teamId) {
    const result = await fetchSportmonksApi(
      'football/fixtures/between',
      `${startDate}/${endDate}/${teamId}`,
      undefined,
      undefined,
      'filters=lineupDetailTypes:118',
    );

    return result;
  }
};
