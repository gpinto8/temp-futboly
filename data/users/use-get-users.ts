import { UsersCollectionProps } from '@/firebase/db-types';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppSelector } from '@/store/hooks';
import { DocumentReference } from 'firebase/firestore';

export const useGetUsers = () => {
  const league = useAppSelector((state) => state.league);
  const user = useAppSelector((state) => state.user);

  const getUser = () => user;

  const getUserFromUui = async (uid: string) => {
    if (uid) {
      const data: any = await firestoreMethods(
        'users',
        uid as any,
      ).getDocumentData();

      return data as UsersCollectionProps;
    }
  };

  // REMOVE AN USER FROM CURRENT LEAGUE
  const removeUserFromLeague = async (userId: string) => {
    if (userId && league.players?.length) {
      const userLeagueData = league.players?.find(
        (player) => player?.uid === userId,
      );
      if (!userLeagueData?.uid) return; // If the user doesnt exist or its not inside the league players, then return
      if (userLeagueData?.role === 'owner') return; // Cant remove the owner of the league ofc ..

      const filteredPlayers = league.players.filter(
        (player) => player.uid !== userId,
      );

      await firestoreMethods('leagues', league.id as any).replaceField(
        'players',
        filteredPlayers,
      );
    }
  };

  const getUserRefById = (userId: string) => {
    const userRef = firestoreMethods('users', userId as any).getDocRef();
    return userRef
      ? (userRef as DocumentReference<UsersCollectionProps>)
      : (null as null);
  };

  // GET CURRENT USER REF FIREBASE DATA
  const getCurrentUserRef = () => {
    const currentUser = getUser()?.id;
    if (currentUser) return getUserRefById(currentUser);
  };

  return {
    getUser,
    removeUserFromLeague,
    getUserFromUui,
    getUserRefById,
    getCurrentUserRef,
  };
};
