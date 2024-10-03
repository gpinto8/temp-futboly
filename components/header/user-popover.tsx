import { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { CustomModal } from '@/components/custom/custom-modal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CustomCard } from '@/components/custom/custom-card';
import { CustomTable } from '@/components/custom/custom-table';
import { ColumnsProps, RowsProps } from '../custom/custom-table';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomImage } from '../custom/custom-image';
import {
  CreateLeagueModal,
  JoinPublicLeagueModal,
} from '@/components/modal/leagues-modal';
import { LeaguesModal } from '@/components/modal/leagues-modal';
import { LeaguesCollectionProps } from '@/firebase/db-types';
import { leagueActions } from '@/store/slices/league';
import { Loader } from '@/components/loader';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useSetLeague } from '@/data/leagues/use-set-league';

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
  { id: 'ICON', label: ' ', minWidth: 20, align: 'center' },
  { id: 'LEAGUE', label: 'League', minWidth: 50, align: 'center' },
  { id: 'TEAM', label: 'Team', minWidth: 30, align: 'center' },
  { id: 'PLAYERS', label: 'Players', minWidth: 30, align: 'center' },
  { id: 'COMPETITIONS', label: 'Competitions', minWidth: 30, align: 'center' },
  { id: 'SELECT', label: 'Select', minWidth: 30, align: 'center' },
  { id: 'EXIT', label: 'Exit', minWidth: 30, align: 'center' },
];

const getRows = (
  leagues: Array<LeaguesCollectionProps>,
  dispatch: any,
  user: { uid: string; username: string },
  exitLeague: any,
) => {
  return leagues.map((league: LeaguesCollectionProps) => {
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
      PLAYERS: league.players.length.toString() + ' / 10',
      COMPETITIONS: league.competitions.length,
      SELECT: (
        <CustomButton
          style="outlineMain"
          label="Select"
          disableElevation
          className="rounded-full text-xs py-1 my-1 px-4 h-full"
          handleClick={() =>
            dispatch(
              leagueActions.setLeague({
                ...league,
                ownerUsername: league.ownerUsername as '',
                documentId: '' as '' | undefined,
              }),
            )
          }
        />
      ),
      EXIT: (
        <CustomButton
          style="outlineMain"
          label="Exit"
          disableElevation
          className="rounded-full text-xs py-1 my-1 px-2 h-full"
          handleClick={() => exitLeague(league, user)}
        />
      ),
    };
  });
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
      <UserSection isModal={true} handleClose={handleClose} />
    </CustomModal>
  ) : (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <UserSection isModal={false} handleClose={handleClose} />
    </Popover>
  );
};

const UserSection = ({ handleClose, isModal }) => {
  const [check, setCheck] = useState(true);
  const user = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.league);
  const { getLeaguesByPlayer } = useGetLeagues();
  const dispatch = useAppDispatch();
  const { exitLeague } = useSetLeague();
  const [rows, setRows] = useState<RowsProps<LeaguesColumnKeysProps>>();

  const deleteElement = (league, user) => {
    exitLeague(league.id, league, user.uid);
    setCheck(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!check) return;
      const data = await getLeaguesByPlayer(user.uid);
      if (!data) return;
      setRows(
        getRows(
          data as LeaguesCollectionProps[],
          dispatch,
          user,
          deleteElement,
        ),
      );
      setCheck(false);
    };

    fetchData();

    return () => {
      //console.log('Component unmounted');
    };
  }, [check]);

  return (
    <div className="px-0 sm:mx-2 md:px-4 mt-2 rounded-2xl md:min-w-[500px]">
      {!isModal && (
        <div
          id="rulesTitle"
          className="p-2 flex flex-row items-center justify-between"
        >
          <div className="flex">
            Hello, <div className="ml-1 font-bold">{user.username}</div>
          </div>
          <div id="closeUserPopover">
            <button
              onClick={handleClose}
              type="button"
              className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Close User Popover</span>
              <CustomImage
                imageKey="CLOSE_ICON"
                className="h-4 w-4"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      )}
      <div
        id="actualLeague"
        className="my-4 flex flex-col gap-2 items-center justify-center"
      >
        <div className="flex flex-col items-center justfy-center">
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
              <p className="text-nowrap font-medium text-gray-500 text-sm">
                {
                  league?.competitions?.find(
                    (competition) => competition.active,
                  )?.name
                }
              </p>
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
              elevation={1}
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
      <div id="leagueActions" className="flex flex-row gap-4 mx-4 py-2">
        <CreateLeagueModal buttonFull={true} />
        <LeaguesModal />
      </div>
    </div>
  );
};
