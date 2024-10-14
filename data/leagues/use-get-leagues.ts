// import { useAppSelector } from '@/store/hooks';
import { useGetUsers } from '../users/use-get-users';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { LeaguesCollectionProps, UsersCollectionProps } from '@/firebase/db-types';

export const useGetLeagues = () => {
  // const league = useAppSelector((state) => state.league);
  const { getUserFromUui } = useGetUsers();

  // const mapLeague = (league) => {
  //   return {
  //     ...league,
  //     id: league?.id,
  //     name: league?.name,
  //     ownerId: league?.owner,
  //     ownerUsername: league?.ownerUsername,
  //     competitionsNo: league.competitions.length,
  //     documentId: league.documentId,
  //   };
  // };

  // // GET CURRENT LEAGUE DATA FROM REDUX
  // const getLeague = () => mapLeague(league);

  const getLeaguesByUid = async (uid: string) => {
    try {
      const leagues = await firestoreMethods("leagues", "id").getDocsByQuery(`players.${uid}`, ">", "");
      // console.log({ leagues }); Commented because seems to be working
      return leagues ? leagues as LeaguesCollectionProps[] : [];  //I assure that an array is returned
    } catch (error) {
      console.error('Error getting leagues: ', error);
    }
  };

  const getLeagueByShortId = async (shortId: string) => {
    if (!shortId.trim()) return;
    const league = await firestoreMethods('leagues', 'id').getDocsByQuery(
      'shortId',
      '==',
      shortId,
    );
    return league ? league as LeaguesCollectionProps : null as null;
  };

  const getAllLeaguesByChunks = async (
    start: QueryDocumentSnapshot | undefined,
    limit: number,
  ) => {
    const result = await firestoreMethods('leagues', 'id').getDocsByChunk(
      limit,
      start,
    );
    if (result) {
      const { docs, lastVisible, hasMore } = result;
      return { leagues: docs, lastVisible, hasMore } as { leagues: LeaguesCollectionProps[], lastVisible: QueryDocumentSnapshot | null, hasMore: boolean };
    }
    return { leagues: [], lastVisible: null, hasMore: false } as { leagues: LeaguesCollectionProps[], lastVisible: QueryDocumentSnapshot | null, hasMore: boolean };
  };

  // CHECK IF CURRENT USER HAS ANY LEAGUES --> TODO: recover the data from redux and not querying the db again
  const hasLeagues = async (uid: string) => {
    const leagueIds = await getLeaguesByUid(uid);
    const hasUserLeagues = !leagueIds || !!(leagueIds?.length > 0);
    return hasUserLeagues as Boolean;
  };

  // GET LEAGUE DATA BY ITS ID
  const getLeagueById = async (leagueId: string) => {
    const league = await firestoreMethods(
      'leagues',
      leagueId as any,
    ).getDocumentData();
    return league ? league as LeaguesCollectionProps : null as null;
  };

  // GET LEAGUE'S OWNER DATA (SINCE OWNER !== CURRENT USER (OR MAYBE IT IS BUT JUST ONCE OFC))
  // const getLeagueOwner = async (leagueId: string) => {
  //   const data = await getLeagueById(leagueId) as LeaguesCollectionProps | null; //Mi dice che restituisce un Unknown
  //   //const data = await getLeagueById(leagueId);
  //   if (data?.players) {
  //     const ownerEntry = Object.entries(data.players).find(([key, value]) => value === "owner");
  //     const ownerId = ownerEntry ? ownerEntry[0] : undefined;
  //     if (!ownerId) return {};
  //     const owner: UsersCollectionProps = await getUserFromUui(ownerId);
  //     // console.log({ owner });
  //     return {owner};
  //   } else return {};
  // };

  return {
    // getLeague,
    getAllLeaguesByChunks,
    getLeagueByShortId,
    hasLeagues,
    getLeaguesByUid,
    getLeagueById,
    // getLeagueOwner,
  };
};
