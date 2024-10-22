import { useAppSelector } from '@/store/hooks';
import { useGetUsers } from '../users/use-get-users';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { LeaguesCollectionProps, UsersCollectionProps, MappedPlayerProps, MappedLeaguesProps } from '@/firebase/db-types';
import { DocumentReference } from 'firebase/firestore';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';

export const useGetLeagues = () => {
  const league = useAppSelector((state) => state.league);
  const { getUserFromUui } = useGetUsers();
  const { getCompetitionsByLeagueId } = useGetCompetitions();

  const mapLeague = async (league: LeaguesCollectionProps) => {
    const mappedPlayers = await Promise.all(Object.entries(league.players).map(async ([uid, role]) => {
      const player = await getUserFromUui(uid);
      return {
        uid,
        role,
        username: player?.username,
      } as MappedPlayerProps;
    }));
    const returnLeague: MappedLeaguesProps = {
      ...league,
      players: mappedPlayers,
      ownerUsername: ""
    };
    const ownerUsername = returnLeague?.players.find(player => player.role === 'owner');
    const leaguesCompetitions = await getCompetitionsByLeagueId(league.id);
    
    return {
      ...returnLeague,
      ownerUsername: ownerUsername?.username,
      competitionsNo: leaguesCompetitions.length,
    } as MappedLeaguesProps;
  };

  // // GET CURRENT LEAGUE DATA FROM REDUX
  const getLeague = async () => await mapLeague(league);

  const getActiveLeagueByUid = async (uid: string, user?: UsersCollectionProps) => {
    if (user) {
      const leagueRef = user.activeLeague;
      if (leagueRef) {
        const league = await getLeagueById(leagueRef);  //If league doesn't exist has to be handled
        if (league) return league as LeaguesCollectionProps;
      }
    }
    const leagues = await firestoreMethods("leagues", "id").getDocsByQuery(`players.${uid}`, ">", "");
    return leagues ? leagues[0] as LeaguesCollectionProps : null as null; //Return the first one it finds --> TODO put limit 1
  };

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
    return hasUserLeagues as boolean;
  };

  // GET LEAGUE DATA BY ITS ID
  const getLeagueById = async (leagueId: DocumentReference<LeaguesCollectionProps>) => {
    const league = await firestoreMethods(
      'leagues',
      leagueId as any,
    ).getDocumentData();
    return league ? league as LeaguesCollectionProps : null as null;
  };

  const getLeagueRefById = (leagueId: string) => {
    const league = firestoreMethods('leagues', leagueId as any).getDocRef();
    return league ? league as DocumentReference<LeaguesCollectionProps> : null as null;
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
    getLeague,
    getActiveLeagueByUid,
    getAllLeaguesByChunks,
    getLeagueByShortId,
    hasLeagues,
    getLeaguesByUid,
    getLeagueById,
    getLeagueRefById,
    // getLeagueOwner,
  };
};
