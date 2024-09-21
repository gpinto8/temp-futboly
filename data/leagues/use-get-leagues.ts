import { useAppSelector } from '@/store/hooks';
import { useGetUsers } from '../users/use-get-users';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export const useGetLeagues = () => {
  const league = useAppSelector((state) => state.league);
  const { getUserFromUui } = useGetUsers();

  const mapLeague = (league) => {
    return {
      ...league,
      id: league?.id,
      name: league?.name,
      ownerId: league?.owner,
      ownerUsername: league?.ownerUsername,
      competitionsNo: league.competitions.length,
      documentId: league.documentId,
    };
  };

  // GET CURRENT LEAGUE DATA FROM REDUX
  const getLeague = () => mapLeague(league);

  // GET A LEAGUE FROM USER ID ----> FEELS KINDA SUS TO ME BECAUSE THE USER ATM DO NOT HAVE THE LEAGUE DETAIL IN THE USER COLLECTION
  const getLeagueByUid = async (uid: string) => {
    const userData: any = await getUserFromUui?.(uid); // get user data
    // console.log({ userData });
    const leagues = userData?.leagues?.map((league: any) => league.id); // get league from user
    // console.log({ leagues });
    if (leagues) {
      const activeLeagueId = leagues?.[0]; // to change once we get to the header to change league // get current league
      // console.log({ activeLeagueId });
      const data = await getLeagueById(activeLeagueId);
      // console.log({ data });
      return { data, documentId: activeLeagueId };
    } else return {};
  };

  const getLeagueByShortId = async (shortId: string) => {
    if (!shortId.trim()) return;
    const league = await firestoreMethods('leagues', 'id').getDocsByQuery(
      'shortId',
      '==',
      shortId,
    );
    return league;
  };

  // GET ALL LEAGUE IDS FROM CURRENT USER ID
  const getLeagueIds = async (uid: string): Promise<string[]> => {
    const userData: any = await getUserFromUui?.(uid); // get user data
    const leagueIds = userData?.leagues?.map((league: any) => league?.id); // get league from user
    return leagueIds;
  };

  // GET ALL LEAGUES FROM CURRENT USER ID
  const getLeagues = async (uid: string) => {
    const leagueIds = await getLeagueIds(uid);
    if (leagueIds) {
      const leagueData: any = [];
      for await (const leagueId of leagueIds) {
        const league = await getLeagueById(leagueId);
        leagueData.push({
          leagueId,
          league,
        });
      }
      return leagueData;
    } else return {};
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
      return { leagues: docs, lastVisible, hasMore };
    }
    return { leagues: [], lastVisible: null, hasMore: false };
  };

  const getLeaguesByPlayer = async (uid: string) => {
    const leagues = await firestoreMethods('leagues', 'id').getDocsByQuery(
      'players',
      'array-contains',
      uid,
    );
    return leagues;
  };

  // CHECK IF CURRENT USER HAS ANY LEAGUES
  const hasLeagues = async (uid: string) => {
    const leagueIds = await getLeagueIds(uid);
    const hasUserLeagues = !!(leagueIds?.length > 0);
    return hasUserLeagues;
  };

  // GET LEAGUE DATA BY ITS ID
  const getLeagueById = async (leagueId: string) => {
    const league = await firestoreMethods(
      'leagues',
      leagueId as any,
    ).getDocumentData();
    return league;
  };

  // GET LEAGUE'S OWNER DATA (SINCE OWNER !== CURRENT USER (OR MAYBE IT IS BUT JUST ONCE OFC))
  const getLeagueOwner = async (uid: string) => {
    const { data }: any = await getLeagueByUid(uid);
    // console.log({ data });
    if (data) {
      const ownerId = data.owner;
      // console.log({ ownerId });
      const owner: any = await getUserFromUui(ownerId);
      // console.log({ owner });
      return {
        id: ownerId,
        username: owner.username,
      };
    } else return {};
  };

  return {
    getLeague,
    getLeagueIds,
    getAllLeaguesByChunks,
    getLeaguesByPlayer,
    getLeagueByShortId,
    getLeagues,
    hasLeagues,
    getLeagueByUid,
    getLeagueById,
    getLeagueOwner,
  };
};
