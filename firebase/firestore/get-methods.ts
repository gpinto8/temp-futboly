import { getFirestoreData } from './methods';
import { LeaguesCollectionProps, UsersCollectionProps } from './types';

export const getFirestoreUsers = async (uid: string) => {
  const data = await getFirestoreData<UsersCollectionProps>('users', uid as any);
  return data;
};

export const getFirestoreLeagues = async (id: number) => {
  const data = await getFirestoreData<LeaguesCollectionProps>('leagues', id as any);
  return data;
};
