import { useState } from 'react';
import { LiveMatch } from './live-match';
import { UpcomingMatches } from './upcoming-matches';

export const LiveMatchTab = () => {
  useState();
  return (
    <div className="flex flex-col gap-16">
      <LiveMatch />
      <div className="border-b border-b-gray" />
      <UpcomingMatches />
    </div>
  );
};
