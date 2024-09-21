'use client';

import { useEffect, useState } from 'react';
import { CustomInput, InputProps } from '../custom/custom-input';
import { CustomModal } from '../custom/custom-modal';
import { ColumnsProps, RowsProps } from '../custom/custom-table';
import { Avatar } from '@mui/material';
import { fetchSportmonksApiClient } from '@/sportmonks/fetch-api-client';
import { PlayersGetAllQueryParamProps } from '@/pages/api/sportmonks/players/get-all';
import { getPlayerRating } from '@/sportmonks/common-methods';
import { SelectableTable } from '../table/selectable-table';
// @ts-ignore
type HandleChangeParamProps = Parameters<InputProps['handleChange']>[0];
type PlayersColumnKeysProps = 'ID' | 'PLAYER' | 'POSITION' | 'RATING' | 'CLUB';

export const EditTeamModal = (row: any) => {
  const [pageCounter, setPageCounter] = useState(1);
  const [rows, setRows] = useState<any>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [name, setName] = useState<HandleChangeParamProps>();
  const [owner, setOwner] = useState<HandleChangeParamProps>();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  const columns: ColumnsProps<PlayersColumnKeysProps> = [
    { label: 'Player', id: 'PLAYER', minWidth: 200 },
    { label: 'Position', id: 'POSITION', align: 'center', minWidth: 100 },
    { label: 'Rating', id: 'RATING', align: 'center', minWidth: 50 },
    { label: 'Club', id: 'CLUB', align: 'center', minWidth: 50 },
  ];

  const mapPlayerRow = (player: any, index: number) => {
    const {
      id,
      image_path,
      display_name,
      detailedPosition,
      position,
      teams,
      statistics,
    } = player;
    const rating = getPlayerRating(statistics);
    const club = teams?.[0]?.team.short_code;

    return {
      ID: index + 1,
      PLAYER: (
        <div className="flex gap-1">
          <Avatar
            src={image_path}
            alt={display_name}
            sx={{ width: 24, height: 24 }}
          />
          <span className="line-clamp-1">{display_name}</span>
        </div>
      ),
      POSITION: detailedPosition?.name || position?.name,
      RATING: rating,
      CLUB: club,
    };
  };

  // Whenever the players state changes we update the table rows here
  useEffect(() => {
    (async () => {
      const rows: RowsProps<PlayersColumnKeysProps> = (players as any)
        ?.map(
          (player: any, index: number) =>
            !selectedPlayerIds.includes(player.id) &&
            mapPlayerRow(player, index),
        )
        .filter(Boolean);

      setRows(rows);
    })();
  }, [players, selectedPlayerIds]);

  // When opening the edit modal, we fetch all the first x players
  const getPlayers = async () => {
    const data = await fetchSportmonksApiClient<PlayersGetAllQueryParamProps>(
      'PLAYERS/GET-ALL',
    );
    setPlayers(data.data);
  };

  // When the end of the table is reached, we fetch the next players page
  const handleEndReached = async () => {
    const newPageCounter = pageCounter + 1;
    setPageCounter(newPageCounter);

    const data = await fetchSportmonksApiClient<PlayersGetAllQueryParamProps>(
      'PLAYERS/GET-ALL',
      {
        page: newPageCounter,
      },
    );
    if (players) setPlayers([...players, ...data.data]);
  };

  const handleClose = () => {
    setPageCounter(1); // Resetting the count so the next time we open up the modal we start from the beginning and not from the part we left it on
  };

  const handleSelectedRows = (
    selectedRows: RowsProps<PlayersColumnKeysProps>,
  ) => {
    const playerIds = selectedRows.map((row) => row.ID);
    setSelectedPlayerIds(playerIds);
  };

  const handleEdit = () => {
    console.log({ name, owner, selectedPlayerIds });
  };

  return (
    <CustomModal
      title={`${row?.row?.TEAM}`}
      unboldedTitle="'s team"
      openButton={{
        label: 'Edit',
        className: '!w-1/4 !h-3/4',
        handleClick: getPlayers,
      }}
      closeButton={{ label: 'Edit team', handleClick: handleEdit }}
      handleClose={handleClose}
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-8 h-full">
          <div className="flex flex-col gap-2">
            <div className="font-bold">Choose information:</div>
            <div className="flex flex-col gap-2 md:flex-row">
              <CustomInput label="Name" handleChange={setName} />
              <CustomInput label="Owner" handleChange={setOwner} />
            </div>
          </div>
          <div className="flex flex-col gap-2 h-full">
            <div className="font-bold">Choose players:</div>
            <SelectableTable<PlayersColumnKeysProps>
              columns={columns}
              rows={rows}
              onEndReached={handleEndReached}
              getSelectedRows={handleSelectedRows}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
