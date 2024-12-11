'use client';

import { CustomImage } from '@/components/custom/custom-image';
import { CreateLeagueModal } from '@/components/modal/leagues-modal';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { LeagueList } from '@/components/league-list';
import { CustomSeparator } from '@/components/custom/custom-separator';

const FirstTime = () => (
  <div className="mt-12 min-w-full h-full">
    <div className="flex pb-4 flex-row gap-4 justify-between items-end">
      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-start gap-2">
          <h1 className="text-3xl font-bold">Create a League</h1>
          <div className="flex flex-col gap-4 justify-center">
            <p className="text-sm">
              Play with your friends with a <strong>private league</strong> or
              make new ones with a <strong>public league!</strong>
            </p>
            <CreateLeagueModal buttonFull={false} />
          </div>
        </div>
        <CustomSeparator withText={true} text="OR" />
        <div className="flex flex-col justify-center items-start gap-2">
          <h1 className="text-3xl font-bold">Join a League</h1>
          <p>Choose one from the list below or join a league</p>
        </div>
      </div>
      {useBreakpoint() !== 'sm' && (
        <div>
          <CustomImage
            imageKey="LEAGUE_ILLUSTRATION"
            width={300}
            height={300}
          />
        </div>
      )}
    </div>
    <LeagueList />
  </div>
);

export default FirstTime;
