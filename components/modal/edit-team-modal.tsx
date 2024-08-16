'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CustomInput, InputProps } from '../custom/custom-input';
import { CustomModal } from '../custom/custom-modal';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import Image from 'next/image';
import { IMG_URLS } from '@/utils/img-urls';
import { Avatar } from '@mui/material';
import { fetchSportmonksApiClient } from '@/sportmonks/fetch-api-client';
import { PlayersGetIdQueryParamProps } from '@/pages/api/sportmonks/players/get-by-id';
import { PlayersGetAllQueryParamProps } from '@/pages/api/sportmonks/players/get-all';
import { getPlayerRating } from '@/sportmonks/utils/get-player-rating';

// @ts-ignore
type HandleChangeParamProps = Parameters<InputProps['handleChange']>[0];
type PlayersColumnKeysProps = 'ID' | 'PLAYER' | 'POSITION' | 'RATING' | 'CLUB' | 'ACTIONS';

const SelectIcon = ({
  playerId,
  selectedPlayerIds,
  setSelectedPlayerIds,
}: {
  playerId: number;
  selectedPlayerIds: number[];
  setSelectedPlayerIds: Dispatch<SetStateAction<number[]>>;
}) => {
  const selected = selectedPlayerIds?.includes(playerId);
  const icon = selected ? IMG_URLS.CHECK_ICON : IMG_URLS.PLUS_ICON;

  const handleSelect = () => setSelectedPlayerIds([...selectedPlayerIds, playerId]);

  return (
    <div className="flex justify-center items-center cursor-pointer w-6 h-8">
      <Image src={icon.src} alt={icon.alt} width={25} height={25} onClick={handleSelect} />
    </div>
  );
};

export const EditTeamModal = (row: any) => {
  const [pageCounter, setPageCounter] = useState(1);
  const [rows, setRows] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [name, setName] = useState<HandleChangeParamProps>();
  const [owner, setOwner] = useState<HandleChangeParamProps>();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  const columns: ColumnsProps<PlayersColumnKeysProps> = [
    { label: '#', id: 'ID', width: 30 },
    { label: 'Player', id: 'PLAYER' },
    { label: 'Position', id: 'POSITION', centered: true },
    { label: 'Rating', id: 'RATING', centered: true, width: 50 },
    { label: 'Club', id: 'CLUB', centered: true, width: 50 },
    { label: '', id: 'ACTIONS', centered: true, width: 30 },
  ];

  const mapPlayerRow = (player: any) => {
    const { id, image_path, display_name, detailedPosition, position, teams, statisitcs } = player;
    const rating = getPlayerRating(statisitcs);

    return {
      ID: id,
      PLAYER: (
        <div className="flex gap-1">
          <Avatar src={image_path} alt={display_name} sx={{ width: 24, height: 24 }} />
          <span className="line-clamp-1">{display_name}</span>
        </div>
      ),
      POSITION: detailedPosition?.name || position?.name || '-',
      RATING: rating || '-',
      CLUB: teams?.[0]?.team.short_code || '-',
      ACTIONS: (
        <SelectIcon
          playerId={id}
          selectedPlayerIds={selectedPlayerIds}
          setSelectedPlayerIds={setSelectedPlayerIds}
        />
      ),
    };
  };

  // For every "selectedPlayerIds" (aka when you click the "+" icon) lets fetch that player by id and add it to the "selectedRows" state
  useEffect(() => {
    (async function () {
      if (!selectedPlayerIds.length) return;

      const players: RowsProps<PlayersColumnKeysProps> = [];
      for await (const id of selectedPlayerIds) {
        const player = await fetchSportmonksApiClient<PlayersGetIdQueryParamProps>(
          'PLAYERS/GET-BY-ID',
          { id }
        );
        const mappedPlayer = mapPlayerRow(player.data);
        players.push(mappedPlayer);
      }

      setSelectedRows(players);
    })();
  }, [selectedPlayerIds]);

  // When opening the edit modal, we fetch all the first x players
  const getPlayers = async () => {
    const data = await fetchSportmonksApiClient<PlayersGetAllQueryParamProps>('PLAYERS/GET-ALL');
    setPlayers(data.data);
  };

  // When the end of the table is reached, we fetch the next players page
  const handleEndReached = async () => {
    const newPageCounter = pageCounter + 1;
    setPageCounter(newPageCounter);

    const data = await fetchSportmonksApiClient<PlayersGetAllQueryParamProps>('PLAYERS/GET-ALL', {
      page: newPageCounter,
    });
    if (players) setPlayers([...players, ...data.data]);
  };

  // Whenever the players state changes we update the table rows here
  useEffect(() => {
    (async () => {
      const rows: RowsProps<PlayersColumnKeysProps> = (players as any)
        ?.map((player: any) => !selectedPlayerIds.includes(player.id) && mapPlayerRow(player))
        .filter(Boolean);

      setRows(rows);
    })();
  }, [players, selectedPlayerIds]);

  const handleClose = () => {
    setPageCounter(1); // Resetting the count so the next time we open up the modal we start from the beginning and not from the part we left it on
  };

  const handleEdit = () => {
    console.log({ name, owner, selectedPlayerIds });
  };

  return (
    <CustomModal
      title={`${row?.row?.TEAM}`}
      unboldedTitle="'s team"
      className="h-[80vh]"
      openButton={{
        label: 'Edit',
        className: '!w-1/4 !h-3/4',
        handleClick: getPlayers,
      }}
      closeButton={{ label: 'Edit team', handleClick: handleEdit }}
      handleClose={handleClose}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-bold">Choose information:</div>
            <div className="flex gap-2">
              <CustomInput label="Name" handleChange={setName} />
              <CustomInput label="Owner" handleChange={setOwner} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold">Choose players:</div>
            <CustomTable<PlayersColumnKeysProps>
              rows={[...selectedRows, ...rows]}
              columns={columns}
              onEndReached={handleEndReached}
              height={310}
              elevation={0}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
