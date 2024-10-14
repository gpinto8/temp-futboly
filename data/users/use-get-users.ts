import { UsersCollectionProps } from '@/firebase/db-types';
import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';

export const useGetUsers = () => {
  // const user = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.league);
  const dispatch = useAppDispatch();

//  const getUser = () => ({
//     id: user.uid,
//     username: user.username,
//   }); 

  const getUserFromUui = async (uid: string) => {
    if (uid) {
      const data: any = await firestoreMethods(
        'users',
        uid as any,
      ).getDocumentData();
      return data as UsersCollectionProps;
    }
  };

  // GET ALL USERS FROM THE CURRENT LEAGUE
  // const getLeagueUsers = async () => {
  //   const usersData: any = [];

  //   for await (const [index, playerId] of league.players.entries()) {
  //     const leagueUser = await getUserFromUui(playerId.toString());
  //     // console.log({ playerId, index, leagueUser });
  //     usersData.push({
  //       indexNo: index + 1,
  //       ownerId: playerId,
  //       ownerUsername: leagueUser?.username,
  //       team: 'TODO',
  //     });
  //   }
  //   return usersData;
  // };

  // GET ALL LEAGUES FROM THE CURRENT USER
  // const getUserLeagues = async () => {
    // console.log({ getUser: getUser(), userUid: user.uid });
    // const userData = await getUserFromUui(user.uid);
    // console.log({ userData });
    // return userData?.leagues;
    // return await getLeagueByUid(user.uid);
  // };

  // REMOVE AN USER FROM CURRENT LEAGUE
  const removeUserFromLeague = async (userId: string) => {
    // const filteredTeams = league.teams.filter((team) => team.owner !== userId);
    if (!userId || !league.players[userId]) return;
    if (league.players[userId] === 'owner') return "Can't remove the owner of the league";
    const filteredPlayers = Object.entries(league.players).filter(([player, role]) => player !== userId);

    await firestoreMethods('leagues', league.id as any).replaceField(
      'players',
      filteredPlayers,
    );
    // dispatch(leagueActions.setAllTeams(filteredTeams));
  };

  return {
    // getUser,
    // getUserLeagues,
    // getLeagueUsers,
    removeUserFromLeague,
    getUserFromUui,
  };
};
