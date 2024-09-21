import { firestoreMethods } from '@/firebase/firestore-methods';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { leagueActions } from '@/store/slices/league';

export const useGetUsers = () => {
  const user = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.league);
  const dispatch = useAppDispatch();

  const getUser = () => ({
    id: user.uid,
    username: user.username,
  });

  const getUserFromUui = async (uuid: string) => {
    if (uuid) {
      const data: any = await firestoreMethods(
        'users',
        uuid as any,
      ).getDocumentData();
      return data;
    }
  };

  // GET ALL USERS FROM THE CURRENT LEAGUE
  const getLeagueUsers = async () => {
    const usersData: any = [];

    for await (const [index, playerId] of league.players.entries()) {
      const leagueUser = await getUserFromUui(playerId.toString());
      // console.log({ playerId, index, leagueUser });
      usersData.push({
        indexNo: index + 1,
        ownerId: playerId,
        ownerUsername: leagueUser?.username,
        team: 'TODO',
      });
    }
    return usersData;
  };

  // GET ALL LEAGUES FROM THE CURRENT USER
  const getUserLeagues = async () => {
    // console.log({ getUser: getUser(), userUid: user.uid });
    // const userData = await getUserFromUui(user.uid);
    // console.log({ userData });
    // return userData?.leagues;
    // return await getLeagueByUid(user.uid);
  };

  // REMOVE AN USER FROM CURRENT LEAGUE
  const removeUserFromLeague = async (userId: string) => {
    const filteredTeams = league.teams.filter((team) => team.owner !== userId);

    await firestoreMethods('leagues', league.documentId as any).replaceField(
      'teams',
      filteredTeams,
    );
    dispatch(leagueActions.setAllTeams(filteredTeams));
  };

  return {
    getUser,
    getUserLeagues,
    getLeagueUsers,
    removeUserFromLeague,
    getUserFromUui,
  };
};
