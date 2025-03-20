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
import { TeamLogoPicker } from '../team-logo-picker';

// @ts-ignore
type HandleChangeParamProps = Parameters<InputProps['handleChange']>[0];
type PlayersColumnKeysProps =
  | 'INDEX'
  | 'PLAYER'
  | 'POSITION'
  | 'RATING'
  | 'CLUB';

export type AddEditTeamModalDataProps = {
  logoId: string;
  name: string;
  owner?: string;
  coach: string;
  selectedPlayerIds?: number[];
};

export type AddEditTeamModalProps = {
  data?: Partial<AddEditTeamModalDataProps>;
  isEdit?: boolean;
  onSetData?: (data: AddEditTeamModalDataProps) => void;
  onMount?: () => void;
};

export const AddEditTeamModal = ({
  data,
  isEdit,
  onSetData,
  onMount,
}: AddEditTeamModalProps) => {
  const [pageCounter, setPageCounter] = useState(1);
  const [rows, setRows] = useState<any>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [logoId, setLogoId] = useState(data?.logoId);
  const [name, setName] = useState<HandleChangeParamProps>({
    value: data?.name || '',
    isValid: !!data?.name,
  });
  const [coach, setCoach] = useState<HandleChangeParamProps>({
    value: data?.coach || '',
    isValid: !!data?.coach,
  });
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  const [disabled, setDisabled] = useState(true);

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
      INDEX: index + 1,
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

  // Disable the inputs if they are not valid
  useEffect(() => {
    const allowPlayersCondition = isEdit ? selectedPlayerIds?.length : true;
    const shouldDisable = !!(
      logoId &&
      name?.value &&
      coach?.value &&
      allowPlayersCondition
    );

    setDisabled(!shouldDisable);
  }, [logoId, name, coach, selectedPlayerIds]);

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

  const handleOpen = async () => {
    onMount?.();
    await getPlayers();
  };

  const handleClose = () => {
    setPageCounter(1); // Resetting the count so the next time we open up the modal we start from the beginning and not from the part we left it on
  };

  const handleSelectedRows = (
    selectedRows: RowsProps<PlayersColumnKeysProps>,
  ) => {
    const playerIds = selectedRows.map((row) => row.INDEX);
    setSelectedPlayerIds(playerIds);
  };

  const handleSetTeam = () => {
    const allowPlayersCondition = isEdit ? selectedPlayerIds?.length : true;
    if (logoId && name?.isValid && coach?.isValid && allowPlayersCondition) {
      onSetData?.({
        logoId,
        name: name.value,
        coach: coach.value,
        selectedPlayerIds: isEdit ? selectedPlayerIds : undefined,
      });
    }
  };

  return (
    <CustomModal
      title={isEdit ? `${name.value}` : 'Create your team'}
      unboldedTitle={isEdit ? "'s team" : ''}
      openButton={{
        label: isEdit ? 'Edit' : 'Create your team',
        className: isEdit ? '!w-1/4 !h-3/4' : 'w-full md:w-fit',
        handleClick: handleOpen,
        style: isEdit ? 'black' : 'main',
      }}
      closeButton={{
        label: `${isEdit ? 'Edit' : 'Create'} team`,
        handleClick: handleSetTeam,
        disabled,
      }}
      handleClose={handleClose}
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-8 h-full">
          <div className="flex flex-col gap-4">
            <div className="font-bold">Choose information:</div>
            {/* ICON & NAME */}
            <div className="flex flex-col gap-2 md:flex-row">
              <TeamLogoPicker initialValue={logoId} getLogoId={setLogoId} />
              <CustomInput
                initialValue={name.value}
                label="Name"
                handleChange={setName}
              />
            </div>
            {/* COACH & OWNER */}
            <div className="flex flex-col gap-2 md:flex-row">
              <CustomInput
                initialValue={coach.value}
                label="Coach"
                handleChange={setCoach}
              />
              <CustomInput initialValue={data?.owner} label="Owner" disabled />
            </div>
          </div>
          {/* PLAYERS */}
          <div className="flex flex-col gap-2 h-full">
            <div className="font-bold">Choose players:</div>
            {isEdit ? (
              <SelectableTable<PlayersColumnKeysProps>
                columns={columns}
                rows={rows}
                onEndReached={handleEndReached}
                getSelectedRows={handleSelectedRows}
              />
            ) : (
              <div className="my-2 mx-auto ">
                Ask your admin to add the players.
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
