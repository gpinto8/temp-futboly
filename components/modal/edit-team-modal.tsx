'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { CustomButton } from '../custom/custom-button';
import { CustomInput } from '../custom/custom-input';
import { CustomModal } from '../custom/custom-modal';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import Image from 'next/image';
import { IMG_URLS } from '@/utils/img-urls';
import { Avatar } from '@mui/material';

const SelectIcon = ({
  playerId,
  selectedPlayers,
  setSelectedPlayers,
}: {
  playerId: number;
  selectedPlayers: number[];
  setSelectedPlayers: Dispatch<SetStateAction<number[]>>;
}) => {
  const selected = selectedPlayers?.includes(playerId);
  const icon = selected ? IMG_URLS.CHECK_ICON : IMG_URLS.PLUS_ICON;

  const handleSelect = () => setSelectedPlayers([...selectedPlayers, playerId]);

  return (
    <div className="flex justify-center items-center cursor-pointer w-6 h-8">
      <Image src={icon.src} alt={icon.alt} width={25} height={25} onClick={handleSelect} />
    </div>
  );
};

export const EditTeamModal = (row: any) => {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  // const setSelectedPlayers = (player: any) => _setSelectedPlayers([...selectedPlayers, player]);
  // console.log({ row });
  type PlayersColumnKeysProps = 'ID' | 'PLAYER' | 'POSITION' | 'RATING' | 'CLUB' | 'ACTIONS';

  useEffect(() => {
    console.log('selectedRows', selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    if (!selectedPlayers.length) return;

    // async function* foo() {
    //   yield 1;
    //   yield 2;
    // }

    (async function () {
      const players: any = [];
      console.log('start', selectedPlayers);
      for await (const num of selectedPlayers) {
        console.log({ num });
        const player = await fetch(`/api/get-player-by-id?id=${num}`).then(response =>
          response.json()
        );
        const mappedPlayer = mapPlayerRow(player.data);
        console.log('inner', { mappedPlayer });
        players.push(mappedPlayer);
        // console.log(num);
        // Expected output: 1

        // break; // Closes iterator, triggers return
      }

      console.log('end', selectedRows, players);
      setSelectedRows(players);
    })();

    return;

    /*
    // console.log({ selectedPlayers });
    (async () => {
      // const players = await // Promise.all([
      // async () => {
      console.log(1, { selectedPlayers });
      const rows: any = [];
      await Promise.all([
        new Promise(async resolve => {
          // async function* foo() {
          //   yield 1;
          //   yield 2;
          // }
          // (async function () {
          //   for await (const num of foo()) {
          //     console.log(num);
          //     // Expected output: 1
          //     break; // Closes iterator, triggers return
          //   }
          // })();
          // const mappedPlayers: any = [];
          // await Promise.all([
          //   new Promise(async resolve => {
          //     [1000, 2000, 3000].forEach(async item => {
          //       // sleep function 1000ms
          //       await new Promise(resolve =>
          //         setTimeout(() => {
          //           console.log({ item });
          //           resolve(item);
          //         }, item)
          //       );
          //       // resolve(item);
          //       // await new Promise(resolve =>
          //       //   setTimeout(() => {
          //       //     console.log(item);
          //       //     resolve(true);
          //       //   }, item)
          //       // );
          //     });
          //     resolve(true);
          //   }),
          //   resolve([123123,123123123,123123])
          // async () => {
          //   return await [1000, 2000, 3000].forEach(item => {
          //     console.log({ item });
          //     // new Promise(resolve =>
          //     //   setTimeout(() => {
          //     //     console.log(item);
          //     //     resolve(true);
          //     //   }, item)
          //     // );
          //   });
          // },
          // ]);
          // [1,2,3].forEach(playerId => {
          // })
          // await Promise.all([
          //   new Promise(async resolve => {
          //     resolve(
          //       selectedPlayers.map(async playerId => {
          //         const player = await fetch(`/api/get-player-by-id?id=${playerId}`).then(
          //           response => response.json()
          //         );
          //         const mappedPlayer = mapPlayerRow(player.data);
          //         console.log({ mappedPlayer });
          //         mappedPlayers.push(mappedPlayer);
          //         return player;
          //       })
          //     );
          //   }),
          // ]);
          // console.log('INNER', { mappedPlayers });
          // resolve(mappedPlayers);
        }),
      ]).then(player => {
        console.log(2, { player });
        setRows(player.flat());
      });
      // selectedPlayers.forEach(async playerId => {
      //   const player = await fetch(`/api/get-player-by-id?id=${playerId}`).then(response =>
      //     response.json()
      //   );
      //   console.log({ player });
      //   // const rating = player?.statistics?.[0]?.details?.find(
      //   //   (detail: any) => detail.type_id === 118
      //   // )?.value?.average;

      //   rows.push(mapPlayerRow(player));
      // });
      // },
      // ]);
      // console.log(3, { players });
    })();*/
  }, [selectedPlayers]);

  const columns: ColumnsProps<PlayersColumnKeysProps> = [
    { label: '#', id: 'ID', width: 30 },
    { label: 'Player', id: 'PLAYER' },
    { label: 'Position', id: 'POSITION', centered: true },
    { label: 'Rating', id: 'RATING', centered: true, width: 50 },
    { label: 'Club', id: 'CLUB', centered: true, width: 50 },
    { label: '', id: 'ACTIONS', centered: true, width: 30 },
  ];

  const [players, setPlayers] = useState<any>([]);
  const [pageCounter, setPageCounter] = useState(1);
  // const [intersectedCallback, setIntersectedCallback] = useState<any>();

  const getPlayers = async () => {
    const data = await fetch(`/api/hello?page=${pageCounter}`).then(response => response.json());
    // console.log({ data: data.data });
    setPlayers(data.data);
  };

  const mapPlayerRow = (player: any) => {
    const playerId = player.id;
    const rating = player?.statistics?.[0]?.details?.find((detail: any) => detail.type_id === 118)
      ?.value?.average;
    return {
      ID: playerId,
      PLAYER: (
        <div className="flex gap-1">
          <Avatar
            src={player.image_path}
            alt={player.display_name}
            sx={{ width: 24, height: 24 }}
          />
          <span className="line-clamp-1">{player.display_name}</span>
        </div>
      ),
      POSITION: player.detailedPosition?.name || player.position?.name || '-',
      RATING: rating || '-',
      CLUB: player.teams?.[0]?.id || '-',
      ACTIONS: (
        <SelectIcon
          playerId={playerId}
          // selected={selectedPlayers.includes(playerId)}
          // handleClick={() => setSelectedPlayers([...selectedPlayers, playerId])}
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
        />
      ),
    };
  };

  // const [temp, setTemp] = useState<any>();

  useEffect(() => {
    (async () => {
      // console.log('useffect players', players);

      const rows: RowsProps<PlayersColumnKeysProps> = players?.map((player: any) => {
        const playerId = player.id;

        if (selectedPlayers.includes(playerId)) return {};

        // console.log({ rating });

        // fetch(`/api/get-team-by-id?id=${players.teams?.[0]?.id}`)
        //   .then(response => response.json())
        // .then(data => console.log({ TEAM_DATA: data }));

        // console.log({ playerId });

        return mapPlayerRow(player);
      });
      // console.log({ rows });
      setRows(rows);

      // if (players?.data?.length > 0) {

      //   setIntersectedCallback(_intersectedCallback);
      // }
    })();
  }, [players, selectedPlayers]);

  // useEffect(() => {
  //   console.log('useeffect temp', temp);
  // }, [temp]);

  const intersectedCallback = async () => {
    const newPageCounter = pageCounter + 1;
    setPageCounter(newPageCounter);
    // console.log('intersectedCallback', newPageCounter);
    const data = await fetch(`/api/hello?page=${newPageCounter}`).then(response => response.json());
    if (players) {
      // console.log({ players: players, data: data.data });
      // players.data.push(data.data.flat());
      setPlayers([...players, ...data.data]);
      // await new Promise(resolve => setTimeout(resolve, 5000));

      // return players.data.length;
    }
  };

  // console.log({ row });

  // useEffect(() => {
  //   console.log('SAFASDFASDF');
  // }, [false]);

  return (
    <CustomModal
      title={`${row?.row?.TEAM}`}
      notBoldTitle="'s team"
      className="h-[80vh]"
      buttonClass="!w-1/4 !h-3/4"
      buttonLabel="Edit"
      handleClick={getPlayers}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-bold">Choose information:</div>
            <div className="flex gap-2">
              <CustomInput label="Name" />
              <CustomInput label="Type" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-bold">Choose players:</div>
            <CustomTable<PlayersColumnKeysProps>
              rows={[...selectedRows, ...rows]}
              columns={columns}
              showLastChild
              intersectedCallback={intersectedCallback}
              height={310}
              elevation={0}
            />
          </div>
        </div>
        <CustomButton label="Edit team" />
      </div>
    </CustomModal>
  );
};
