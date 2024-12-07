import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';
import { useGetLeagues } from './use-get-leagues';
import { getShortBase64Id } from '@/utils/id';
import { LeaguesCollectionProps, MappedLeaguesProps } from '@/firebase/db-types';
import { DocumentReference } from 'firebase/firestore';

export const useSetLeague = () => {
  const { getLeagueById } = useGetLeagues();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user); // Can't use the "useGetUsers" hook because it creates an infinite loop since it uses the this hook

  const addLeague = async (leagueProps: LeagueFormDetailsProps) => {
    if (!leagueProps.name || !leagueProps.leaguePassword) return;
    //TODO Verify if the league name is unique
    if (!user.id || !user.username) return;
    const leagueData = await firestoreMethods('leagues', 'id').createDocument({
      ...leagueProps,
      owner: user.id,
      ownerUsername: user.username,
      competitions: [],
      players: { [user.id]: "owner" },
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
    // console.log({ leagueRef });
    const updateUser = await firestoreMethods(
      'users',
      user.id as any,
    ).addDataToField('leagues', leagueRef, 'array');

    // console.log({ updateUser });
    // await setLeague(playerId);
    location.reload(); // TODO: set to redux the updated league data

    // dispatch(leagueActions.setLeague(leagueData));
    return leagueData;
  };

  const exitLeague = async (
    leagueId: string,
    league: LeaguesCollectionProps,
    playerId: string, // TODO: name better the user playerId -> userId
  ) => {
    if (!leagueId || !playerId || !league) return;
    const newPlayers = Object.entries(league.players).filter(([player, role]) => player !== playerId);
    if (newPlayers.length === 0) {
      const updateResult = await firestoreMethods(
        'leagues',
        leagueId as any,
      ).deleteDocument();
      console.log(updateResult);
    } else {
      const updateResult = await firestoreMethods(
        'leagues',
        leagueId as any,
      ).replaceField('players', newPlayers);
      console.log(updateResult);
    }
    location.reload(); // TODO: set to redux the updated league data
  };

  const addPlayerToLeague = async (leagueId: string, playerId: string) => {
    if (!leagueId || !playerId) return;
    const updateLeague = await firestoreMethods(
      'leagues',
      leagueId as any,
    ).createField(playerId, "guest");
    const leagueRef = firestoreMethods('leagues', leagueId as any).getDocRef();
    location.reload(); // TODO: set to redux the updated league data
  };

  // SET LEAGUE TO REDUX FROM THE USER ID --> Here I can pass directly the League object, avoid the fetch and dispatch directly the league with a "random" competition
  const setLeague = async (league: MappedLeaguesProps /*| DocumentReference<LeaguesCollectionProps>*/, uid: string) => {
    // console.log({ uid });
    
    // const data = await getLeagueById(id);

    // if (data) {
      // Update the user active league
      const leagueRef = firestoreMethods('leagues', league.id as any).getDocRef();
      if (!leagueRef) return;
      const userUpdate = await firestoreMethods('users', uid as any).replaceRefField("activeLeague", leagueRef); // Using data.id and not just id for "safety"

      if (userUpdate) {
        dispatch(leagueActions.setLeague(league));  //TODO: Dispatch also the updated user info
      }
    // }
  };

  return { addLeague, exitLeague, setLeague, addPlayerToLeague };
};

type LeagueFormDetailsProps = {
  name: string;
  leaguePassword: string;
  // specificPosition: boolean; Now this prop is defined in the Competition
  isPrivate: boolean;
};