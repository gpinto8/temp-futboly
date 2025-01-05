import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';
import { getShortBase64Id } from '@/utils/id';
import {
  LeaguesCollectionProps,
  MappedLeaguesProps,
  UsersCollectionProps,
} from '@/firebase/db-types';
import { DocumentReference } from 'firebase/firestore';
import { useSetUsers } from '../users/use-set-users';

type LeagueFormDetailsProps = {
  name: string;
  isPrivate: boolean;
  leaguePassword?: string;
};

export const useSetLeague = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user); // Can't use the "useGetUsers" hook because it creates an infinite loop since it uses the this hook
  const {
    deleteLeague,
    deleteActiveLeagueIfExists,
    setActiveLeague,
    addLeagueToUserLeagues,
  } = useSetUsers();

  const addLeague = async (leagueProps: LeagueFormDetailsProps) => {
    if (!leagueProps.name) return;
    if (!user.id || !user.username) return; //TODO Verify if the league name is unique

    const leagueData = await firestoreMethods('leagues', 'id').createDocument({
      ...leagueProps,
      owner: user.id,
      ownerUsername: user.username,
      competitions: [],
      players: { [user.id]: 'owner' },
    });

    const leagueShortID = getShortBase64Id();
    if (leagueShortID === 'Error') return; //Handle better the error re trying or using another ID

    const updateResult = await firestoreMethods(
      'leagues',
      leagueData.id,
    ).createField('shortId', leagueShortID);
    if (!updateResult) return;

    leagueData.shortId = leagueShortID;

    const leagueRef = firestoreMethods('leagues', leagueData.id).getDocRef();
    await firestoreMethods('users', user.id as any).addDataToField(
      'leagues',
      leagueRef,
      'array',
    );

    location.reload(); // TODO: set to redux the updated league data

    return leagueData;
  };

  const exitLeague = async (
    leagueId: string,
    league: LeaguesCollectionProps,
    userId: string,
  ) => {
    if (!leagueId || !userId || !league) return;

    const newPlayers = { ...league.players };
    delete newPlayers[userId];

    // Delete the league from the leagues
    if (Object.keys(newPlayers)?.length === 0) {
      await firestoreMethods('leagues', leagueId as any).deleteDocument();
    } else {
      await firestoreMethods('leagues', leagueId as any).replaceField(
        'players',
        newPlayers,
      );
    }

    // Delete also the league's reference from user's data
    await deleteLeague(userId, leagueId);
    await deleteActiveLeagueIfExists(userId, leagueId);

    location.reload(); // TODO: set to redux the updated league data
  };

  const addPlayerToLeague = async (leagueId: string, playerId: string) => {
    if (!leagueId || !playerId) return;

    await firestoreMethods('leagues', leagueId as any).createField('players', {
      [playerId]: 'guest',
    });

    firestoreMethods('leagues', leagueId as any).getDocRef();

    location.reload(); // TODO: set to redux the updated league data
  };

  // SET LEAGUE TO REDUX FROM THE USER ID --> Here I can pass directly the League object, avoid the fetch and dispatch directly the league with a "random" competition
  const setLeague = async (league: MappedLeaguesProps, userId: string) => {
    await setActiveLeague(userId, league.id);
    await addLeagueToUserLeagues(userId, league.id);

    dispatch(leagueActions.setLeague(league)); //TODO: Dispatch also the updated user info
  };

  // CHECK IF THE USER'S ACTIVE IS THE SAME AS THE LEAGUE ID YOU ARE PASSING (E.G FOR THE USER POPOVER LEAGUE LIST)
  const isLeagueUserActive = (
    user: UsersCollectionProps,
    league: LeaguesCollectionProps,
  ) => {
    const userActiveLeague = user.activeLeague?.id;
    const leagueId = league.id;
    return !!(userActiveLeague === leagueId);
  };

  return {
    addLeague,
    exitLeague,
    setLeague,
    addPlayerToLeague,
    isLeagueUserActive,
  };
};
