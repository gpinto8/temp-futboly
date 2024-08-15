import { useEffect, useState } from 'react';
import { CustomButton } from '../custom/custom-button';
import { CustomInput } from '../custom/custom-input';
import { CustomModal } from '../custom/custom-modal';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import { EditTeamModal } from '../modal/edit-team-modal';

type AdminColumnKeysProps = 'INDEX' | 'TEAM' | 'OWNER' | 'PLAYERS' | 'ACTIONS';

export const AdminTabTeams = () => {
  const rows: RowsProps<AdminColumnKeysProps> = [
    { INDEX: 1, TEAM: 'Team1', OWNER: 'gpinto8', PLAYERS: 49 },
  ].map(row => ({
    ...row,
    ACTIONS: (
      <div className="flex gap-1">
        <EditTeamModal row={row} />
        <CustomButton label="Delete" style="error" className="!w-1/4 !h-1/4" />,
      </div>
    ),
  }));

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX' },
    { label: 'Team', id: 'TEAM' },
    { label: 'Owner', id: 'OWNER' },
    { label: 'Players', id: 'PLAYERS', centered: true },
    { label: 'Actions', id: 'ACTIONS', centered: true },
  ];

  // // useEffect(() => {
  // //   console.log('ONCEEE');
  // // }, []);

  // // useEffect(() => {
  // //   fetch(
  // //     `https://api.sportmonks.com/v3/football/players?api_token=9QudD8bREVydDeSDCCkPHerTQ3TrzmbP0YCOJqTmc0C37eLwRFVYSx7SExnA`,
  // //     {
  // //       mode: 'no-cors',
  // //       cache: 'no-store',
  // //       next: { revalidate: 3600 },
  // //     }
  // //   )
  // //     .then(response => response?.formData())
  // //     .then(data => {
  // //       console.log({ data });
  // //     });
  // // }, []);

  return (
    <div>
      <CustomTable<AdminColumnKeysProps> rows={rows} columns={columns} />
    </div>
  );
};
