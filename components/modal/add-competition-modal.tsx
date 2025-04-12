'use client';

import { useEffect, useState } from 'react';
import { CustomInput } from '../custom/custom-input';
import { CustomModal } from '../custom/custom-modal';
import { ColumnsProps, RowsProps } from '../custom/custom-table';
import { SelectableTable } from '../table/selectable-table';
import { CustomInputDateTime } from '../input/input-date-time';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useGetUsers } from '@/data/users/use-get-users';
import { MappedLeaguesProps, UsersCollectionProps } from '@/firebase/db-types';

type TeamsColumnsKeysProps = 'PLAYER';

const getRows = (league: MappedLeaguesProps | undefined) => {
  if (!league) return [];
  return league.players.map((player, index) => {
    return {
      INDEX: index + 1,
      ID: index + 1,
      PLAYER: player.username,
    };
  });
};

export const AddCompetitionModal = () => {
  const { addCompetition } = useSetCompetitions();
  const { getLeague, getLeagueRefById } = useGetLeagues();
  const { getUserRefById } = useGetUsers();

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [closeButtonDisabled, setCloseButtonDisabled] = useState(true);
  const [league, setLeague] = useState<MappedLeaguesProps>();

  const [name, setName] = useState<string>();
  const [endDate, setEndDate] = useState<Timestamp>();

  const columns: ColumnsProps<TeamsColumnsKeysProps> = [
    { label: 'Player', id: 'PLAYER', align: 'center', minWidth: 100 },
  ];

  const rows: RowsProps<TeamsColumnsKeysProps> = getRows(league);

  const handleCreate = async () => {
    if (!league) return;

    const playersNames = selectedRows.map((row) => row.PLAYER);
    const playersRefs = Object.values(league.players)
      .filter((player) => playersNames.includes(player.username))
      .map((player) =>
        getUserRefById(player.uid),
      ) as DocumentReference<UsersCollectionProps>[];
    const leagueRef = getLeagueRefById(league.id);

    if (endDate && name && playersRefs.length && leagueRef) {
      const todayDate = Timestamp.fromDate(new Date());
      const checkDateValidity = todayDate.seconds < endDate.seconds;

      if (checkDateValidity) {
        await addCompetition({
          name,
          competitionStarted: false,
          endDate,
          specificPosition: false,
          league: leagueRef,
          currentWeek: 0,
          maxWeek: 0,
          players: playersRefs ?? [],
          teams: [],
          standings: null,
          matchSchedule: null,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const league = await getLeague();
      setLeague(league);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const valid = !!(name && selectedRows.length && endDate);
    setCloseButtonDisabled(!valid);
  }, [name, selectedRows, endDate]);

  return (
    <CustomModal
      title="Create a new competition"
      openButton={{
        label: 'Add competition',
        className: 'md:!w-[180px]',
        handleClick: undefined,
        avoidFitWidth: true,
      }}
      closeButton={{
        label: 'Create competition',
        handleClick: handleCreate,
        disabled: closeButtonDisabled,
      }}
      handleClose={undefined}
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-8 h-full">
          <div className="flex flex-col gap-2">
            <div className="font-bold">Choose information:</div>
            <div className="flex flex-col gap-4">
              <CustomInput
                label="Name"
                handleChange={(data) => setName(data.value)}
              />
              <div className="flex gap-4 justify-between">
                <CustomInputDateTime
                  className="w-full"
                  label="End date"
                  getValue={(value) => setEndDate(value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 h-full">
            <div className="font-bold">Choose players:</div>
            <SelectableTable<TeamsColumnsKeysProps>
              columns={columns}
              rows={rows}
              getSelectedRows={(selectedRows) => setSelectedRows(selectedRows)}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
