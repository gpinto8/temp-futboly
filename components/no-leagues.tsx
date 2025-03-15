'use client';

import { Header } from './header';
import FirstTime from './first-time';

export const NoLeagues = () => {
  return (
    <>
      <Header hideRules hideUserPopover />
      <FirstTime />
    </>
  );
};
