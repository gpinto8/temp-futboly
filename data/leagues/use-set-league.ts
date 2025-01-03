import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';
import { useGetLeagues } from './use-get-leagues';
import { getShortBase64Id } from '@/utils/id';
import {
  LeaguesCollectionProps,
  MappedLeaguesProps,
} from '@/firebase/db-types';
import { DocumentReference } from 'firebase/firestore';

type LeagueFormDetailsProps = {
  name: string;
  isPrivate: boolean;
  leaguePassword?: string;
};

export const useSetLeague = () => {
  const { getLeagueById } = useGetLeagues();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user); // Can't use the "useGetUsers" hook because it creates an infinite loop since it uses the this hook

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
    playerId: string, // TODO: name better the user playerId -> userId
  ) => {
    if (!leagueId || !playerId || !league) return;

    const newPlayers = Object.entries(league.players).filter(
      ([player, role]) => player !== playerId,
    );

    if (newPlayers.length === 0) {
      await firestoreMethods('leagues', leagueId as any).deleteDocument();
    } else {
      await firestoreMethods('leagues', leagueId as any).replaceField(
        'players',
        newPlayers,
      );
    }

    location.reload(); // TODO: set to redux the updated league data
  };

  const addPlayerToLeague = async (leagueId: string, playerId: string) => {
    if (!leagueId || !playerId) return;

    await firestoreMethods('leagues', leagueId as any).createField(
      playerId,
      'guest',
    );

    firestoreMethods('leagues', leagueId as any).getDocRef();

    location.reload(); // TODO: set to redux the updated league data
  };

  // SET LEAGUE TO REDUX FROM THE USER ID --> Here I can pass directly the League object, avoid the fetch and dispatch directly the league with a "random" competition
  const setLeague = async (league: MappedLeaguesProps, uid: string) => {
    // Update the user active league
    const leagueRef = firestoreMethods('leagues', league.id as any).getDocRef();
    if (!leagueRef) return;

    const userUpdate = await firestoreMethods(
      'users',
      uid as any,
    ).replaceRefField('activeLeague', leagueRef); // Using data.id and not just id for "safety"

    if (userUpdate) dispatch(leagueActions.setLeague(league)); //TODO: Dispatch also the updated user info
  };

  return { addLeague, exitLeague, setLeague, addPlayerToLeague };
};
