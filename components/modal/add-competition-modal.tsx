'use client';

import { useEffect, useState } from 'react';
import { CustomInput } from '../custom/custom-input';
import { CustomModal } from '../custom/custom-modal';
import { ColumnsProps, RowsProps } from '../custom/custom-table';
import { SelectableTable } from '../table/selectable-table';
import { CustomInputDateTime } from '../input/input-date-time';
import { Timestamp } from 'firebase/firestore';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';

type TeamsColumnsKeysProps = 'ID' | 'TEAM' | 'OWNER';

export const AddCompetitionModal = () => {
  const { addCompetition } = useSetCompetitions();

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [closeButtonDisabled, setCloseButtonDisabled] = useState(true);

  const [name, setName] = useState<string>();
  const [startDate, setStartDate] = useState<Timestamp>();
  const [endDate, setEndDate] = useState<Timestamp>();

  const columns: ColumnsProps<TeamsColumnsKeysProps> = [
    { label: 'Position', id: 'TEAM', align: 'center', minWidth: 100 },
    { label: 'Rating', id: 'OWNER', align: 'center', minWidth: 100 },
  ];

  const rows: RowsProps<TeamsColumnsKeysProps> = [
    { ID: 1, TEAM: 'Team1', OWNER: 'xd' },
    { ID: 2, TEAM: 'Team2', OWNER: 'xd' },
    { ID: 3, TEAM: 'Team3', OWNER: 'xd' },
    { ID: 4, TEAM: 'Team4', OWNER: 'xd' },
    { ID: 5, TEAM: 'Team5', OWNER: 'xd' },
    { ID: 6, TEAM: 'Team6', OWNER: 'xd' },
    { ID: 7, TEAM: 'Team7', OWNER: 'xd' },
    { ID: 8, TEAM: 'Team8', OWNER: 'xd' },
    { ID: 9, TEAM: 'Team9', OWNER: 'xd' },
    { ID: 10, TEAM: 'Team10', OWNER: 'xd' },
  ];

  const handleCreate = async () => {
    const teams = selectedRows.map((row) => row.ID);

    if (endDate && startDate && name && teams.length) {
      const newCompetition = await addCompetition({
        active: false,
        endDate,
        name,
        players: teams,
        startDate,
        type: 'Classic',
      });
    }
  };

  useEffect(() => {
    const valid = !!(name && selectedRows.length && startDate && endDate);
    setCloseButtonDisabled(!valid);
  }, [name, selectedRows, startDate, endDate]);

  return (
    <CustomModal
      title="Create a new competition"
      openButton={{
        label: 'Add competition',
        className: '!w-[180px]',
        handleClick: undefined,
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
                  label="Start date"
                  getValue={(value) => setStartDate(value)}
                />
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
