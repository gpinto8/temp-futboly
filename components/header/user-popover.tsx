import { useState, useEffect } from 'react';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { CustomModal } from '@/components/custom/custom-modal';
import { useAppSelector } from '@/store/hooks';
import { CustomCard } from '@/components/custom/custom-card';
import { CustomTable } from '@/components/custom/custom-table';
import { ColumnsProps, RowsProps } from '../custom/custom-table';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomImage } from '../custom/custom-image';
import { CreateLeagueModal } from '@/components/modal/leagues-modal';
import { LeaguesModal } from '@/components/modal/leagues-modal';
import { LeaguesCollectionProps } from '@/firebase/db-types';
import { Loader } from '@/components/loader';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useSetLeague } from '@/data/leagues/use-set-league';
import { CustomPopover } from '../custom/custom-popover';

type LeaguesColumnKeysProps =
  | 'ICON'
  | 'LEAGUE'
  | 'TEAM'
  | 'PLAYERS'
  | 'COMPETITIONS'
  | 'SELECT'
  | 'EXIT';

type UserPopoverProps = {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  functions: {
    handleClose: () => void;
  };
};

const columns: ColumnsProps<LeaguesColumnKeysProps> = [
  { id: 'ICON', label: ' ', minWidth: 25, align: 'center' },
  { id: 'LEAGUE', label: 'League', minWidth: 150 },
  { id: 'TEAM', label: 'Team', minWidth: 100, align: 'center' },
  { id: 'PLAYERS', label: 'Players', minWidth: 75, align: 'center' },
  { id: 'COMPETITIONS', label: 'Comps', minWidth: 75, align: 'center' },
  { id: 'SELECT', label: ' ', minWidth: 75, align: 'center' },
  { id: 'EXIT', label: ' ', minWidth: 75, align: 'center' },
];

const UserSection = () => {
  const user = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.league);
  const { getLeaguesByUid } = useGetLeagues();
  const { setLeague, exitLeague, isLeagueUserActive } = useSetLeague();
  const [check, setCheck] = useState(true);
  const [rows, setRows] = useState<RowsProps<LeaguesColumnKeysProps>>();

  const getRows = (leagues: LeaguesCollectionProps[]) => {
    return leagues.map((league) => {
      const leagueActive = isLeagueUserActive(user, league);

      return {
        ICON: (
          <CustomImage
            forceSrc="https://cdn.sportmonks.com/images/soccer/leagues/271.png"
            width={16}
            height={16}
          />
        ),
        LEAGUE: league.name,
        TEAM: 'Team',
        PLAYERS: Object.keys(league.players).length.toString() + ' / 10',
        COMPETITIONS: 10,
        SELECT: (
          <CustomButton
            style={leagueActive ? 'black' : 'main'}
            label={leagueActive ? 'Selected' : 'Select'}
            disableElevation
            className="rounded-full text-xs py-1 my-1 px-4 h-full"
            handleClick={() =>
              setLeague(
                league as any, // TODO: create just "MappedLeaguesProps" or "LeaguesCollectionProps" .. having both is confusing
                user.id,
                true,
              )
            }
            disabled={leagueActive}
          />
        ),
        EXIT: (
          <CustomButton
            style="error"
            label="Exit"
            disableElevation
            className="rounded-full text-xs py-1 my-1 px-2 h-full"
            handleClick={() => {
              exitLeague(league.id, league, user.id);
              setCheck(true);
            }}
          />
        ),
      };
    });
  };

  useEffect(() => {
    (async () => {
      if (!check) return;

      const data = await getLeaguesByUid(user.id);
      if (data) {
        setRows(getRows(data));
        setCheck(false);
      }
    })();
  }, [check]);

  return (
    <div className="rounded-2xl md:max-w-[500px] md:w-[50vw]">
      <div
        id="actualLeague"
        className="my-6 flex flex-col gap-2 items-center justify-center"
      >
        <div className="flex flex-col items-center justfy-center gap-2">
          <CustomImage
            forceSrc="https://cdn.sportmonks.com/images/soccer/leagues/271.png"
            width={48}
            height={48}
          />
          <div className="flex flex-row gap-1">
            <p className="text-nowrap font-bold text-gray-800 text-sm">
              {league?.name}
            </p>
            <p className="text-nowrap font-semibold text-gray-600 text-sm">
              's league
            </p>
          </div>
        </div>
        <CustomCard style="gray" className="lg:px-6 w-full">
          <div className="flex flex-row items-center justify-between gap-16 mx-4">
            <div className="flex flex-col items-center justify-center mx-4">
              <CustomImage
                forceSrc="https://cdn.sportmonks.com/images/soccer/leagues/271.png"
                className="h-12 w-12"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col items-center justify-center mx-4">
              <CustomImage
                forceSrc="https://cdn.sportmonks.com/images/soccer/teams/30/62.png"
                className="h-12 w-12"
                width={48}
                height={48}
              />
              <p className="text-nowrap font-medium text-gray-500 text-sm">
                Team
              </p>
            </div>
          </div>
        </CustomCard>
      </div>
      <div id="userLeagueList" className="flex flex-col gap-2 h-full">
        <h4 className="text-pretty font-semibold text-lg mb-2">My Leagues</h4>
        <div className="min-h-[30vh]">
          {!rows && <Loader />}
          {rows && rows.length > 0 ? (
            <CustomTable<LeaguesColumnKeysProps>
              rows={rows}
              columns={columns as ColumnsProps<LeaguesColumnKeysProps>}
              elevation={0}
              className="flex flex-col min-h-[30vh] overflow-y main-scrollbar"
              customizeColumns={{ className: 'text-xs text-dark' }}
              customizeRows={{ className: 'text-sm text-dark' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 mt-4">
              <p className="text-lg font-semibold text-gray-500">
                No leagues found
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        id="leagueActions"
        className="flex flex-row gap-2 justify-between items-center"
      >
        <CreateLeagueModal buttonFull />
        <LeaguesModal />
      </div>
    </div>
  );
};

export const UserPopover = ({
  id,
  open,
  anchorEl,
  functions,
}: UserPopoverProps) => {
  const { handleClose } = functions;
  const user = useAppSelector((state) => state.user);

  return useBreakpoint() === 'sm' ? (
    <CustomModal
      hasOpenButton={false}
      externalStatus={open}
      title={
        <div className="flex text-2xl">
          Hello, <div className="ml-1 font-bold">{user.username}</div>
        </div>
      }
      handleClose={handleClose}
      closeButton={{ label: ' ', hide: true }}
    >
      <UserSection />
    </CustomModal>
  ) : (
    <CustomPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      titleComponent={
        <div
          id="rulesTitle"
          className="flex flex-row items-center justify-between"
        >
          <div className="flex">
            Hello, <div className="ml-1 font-bold">{user.username}</div>
          </div>
        </div>
      }
    >
      <UserSection />
    </CustomPopover>
  );
};
