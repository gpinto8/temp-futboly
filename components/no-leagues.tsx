'use client';

// import { useGetLeagues } from '@/data/leagues/use-get-leagues';
// import { useGetUsers } from '@/data/users/use-get-users';
import { useEffect } from 'react';
import { Header } from './header';
import FirstTime from './first-time';
import { useAppSelector } from '@/store/hooks';

export const NoLeagues = () => {
  // const { getUser } = useGetUsers();
  // const uid = getUser()?.id;
  // const { getLeagues } = useGetLeagues();
  const user = useAppSelector((state) => state.user);
  const uid = user.id;
  // console.log({ user });

  useEffect(() => {
    (async () => {
      // const uid = getUser().id;
      // console.log({ uid });
      // if (uid) {
      // const leagues = await getLeagues(uid);
      // console.log({ leagues });
      // }
      // if (uid) {
      //   const userLeagues = await getLeagues();
      //   console.log({ userLeagues });
      // }
    })();
  }, [uid]);

  return (
    <>
      <Header hideRules hideUserPopover />
      <FirstTime />
    </>
  );
  // return <div className="">PRE HOME</div>;
};
