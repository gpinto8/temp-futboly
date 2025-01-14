import { UsersCollectionProps } from '@/firebase/db-types';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppSelector } from '@/store/hooks';
import { DocumentReference } from 'firebase/firestore';

export const useGetUsers = () => {
  const league = useAppSelector((state) => state.league);

  const getUser = () => {
    return useAppSelector((state) => state.user) as UsersCollectionProps;
  };

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
    if (!userId || !league.players[userId]) return;

    if (league.players[userId] === 'owner') {
      return "Can't remove the owner of the league";
    }

    const filteredPlayers = Object.entries(league.players).filter(
      ([player]) => player !== userId,
    );

    await firestoreMethods('leagues', league.id as any).replaceField(
      'players',
      filteredPlayers,
    );
  };

  const getUserRefById = (userId: string) => {
    const userRef = firestoreMethods('users', userId as any).getDocRef();
    return userRef
      ? (userRef as DocumentReference<UsersCollectionProps>)
      : (null as null);
  };

  return {
    getUser,
    removeUserFromLeague,
    getUserFromUui,
    getUserRefById,
  };
};
