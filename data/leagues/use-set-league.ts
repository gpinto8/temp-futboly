import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';
import { useGetLeagues } from './use-get-leagues';
import { getShortBase64Id } from '@/utils/id';
import { LeaguesCollectionProps } from '@/firebase/db-types';

export const useSetLeague = () => {
  const { getLeagueByUid, getLeagueOwner, getLeagueIds } = useGetLeagues();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user); // Can't use the "useGetUsers" hook because it creates an infinite loop since it uses the this hook

  const addLeague = async (leagueProps: LeagueFormDetailsProps) => {
    if (!leagueProps.name || !leagueProps.leaguePassword) return;
    //TODO Verify if the league name is unique
    if (!user.uid || !user.username) return;
    const leagueData = await firestoreMethods('leagues', 'id').createDocument({
      ...leagueProps,
      owner: user.uid,
      ownerUsername: user.username,
      competitions: [],
      players: [user.uid],
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
      user.uid as any,
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
    const newPlayers = league.players.filter((player) => player !== playerId);
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
      // console.log(updateResult);
    }

    // Also delete the league reference from the "users" collection
    const leagueIds = await getLeagueIds(playerId);
    // console.log({ leagueIds });
    const filteredLeagues = leagueIds.filter(
      (leagueId) => leagueId !== leagueId,
    );
    // console.log({ filteredLeagues });
    const leagueRefsMap = filteredLeagues.map((leagueId) =>
      firestoreMethods('leagues', leagueId as any).getDocRef(),
    );
    // console.log({ leagueRefsMap });
    const updateResult = await firestoreMethods(
      'users',
      playerId as any,
    ).replaceField('leagues', leagueRefsMap);
    // console.log({ updateResult });

    location.reload(); // TODO: set to redux the updated league data
  };

  const addPlayerToLeague = async (leagueId: string, playerId: string) => {
    if (!leagueId || !playerId) return;
    const updateLeague = await firestoreMethods(
      'leagues',
      leagueId as any,
    ).addDataToField('players', playerId, 'array');
    const leagueRef = firestoreMethods('leagues', leagueId as any).getDocRef();
    // console.log({ leagueRef });
    const updateUser = await firestoreMethods(
      'users',
      playerId as any,
    ).addDataToField('leagues', leagueRef, 'array');

    // console.log({ playerId });
    // await setLeague(playerId);
    location.reload(); // TODO: set to redux the updated league data

    // console.log({ updateLeague, updateUser });
  };

  // SET LEAGUE TO REDUX FROM THE USER ID
  const setLeague = async (uid: string) => {
    // console.log({ uid });
    const { data, documentId }: any = await getLeagueByUid(uid);
    // console.log({ data, documentId });
    const ownerLeague: any = await getLeagueOwner(uid);
    // console.log({ ownerLeague });

    if (data && documentId && ownerLeague) {
      dispatch(
        leagueActions.setLeague({
          ...data,
          ownerUsername: ownerLeague.username,
          documentId,
        }),
      );
    }
  };

  return { addLeague, exitLeague, setLeague, addPlayerToLeague };
};

type LeagueFormDetailsProps = {
  name: string;
  leaguePassword: string;
  specificPosition: boolean;
  isPrivate: boolean;
};