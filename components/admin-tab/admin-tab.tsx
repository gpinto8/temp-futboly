import { Chip } from '@mui/material';
import { AdminTabUsers } from './admin-tab-users';
import { useSwitchComponents } from '@/utils/switch-components';
import { AdminTabTeams } from './admin-tab-teams';
import { AdminTabCompetitions } from './admin-tab-competitions';
import { CustomButton } from '../custom/custom-button';
import { CustomModal } from '../custom/custom-modal';
import { CustomInput } from '../custom/custom-input';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';

type ColumnKeysProps = 'INDEX' | 'TEAM' | 'OWNER' | 'ACTIONS';

export const AdminTab = () => {
  const { components, setComponentId, SwitchedComponent, isCurrentId, currentComponentId } =
    useSwitchComponents([
      { label: 'Teams', Component: AdminTabTeams },
      { label: 'Competitions', Component: AdminTabCompetitions },
      { label: 'Users', Component: AdminTabUsers },
    ]);

  const rows: RowsProps<ColumnKeysProps> = [{ INDEX: 1, TEAM: 'Team1', OWNER: 'xd' }].map(row => ({
    ...row,
    ACTIONS: (
      <div className="flex gap-1">
        <CustomButton label="Edit" style="black" className="!w-1/4 !h-1/4" />,
      </div>
    ),
  }));

  const columns: ColumnsProps<ColumnKeysProps> = [
    { label: '#', id: 'INDEX' },
    { label: 'Team', id: 'TEAM' },
    { label: 'Owner', id: 'OWNER' },
    { label: 'Actions', id: 'ACTIONS', centered: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="flex gap-2 md:gap-4">
          {components.map(({ id, label }) => (
            <Chip
              className={`${isCurrentId(id) ? 'text-white bg-main' : 'text-gray'}`}
              key={id}
              label={label}
              onClick={() => setComponentId(id)}
            />
          ))}
        </div>
        {currentComponentId === 'COMPETITIONS' && (
          <CustomModal openButton={{ label: 'Add competition' }} title="Create a new competition">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 h-[400px]">
                <CustomInput label="Name" />
                <CustomInput label="Type" />
                <CustomTable<ColumnKeysProps> rows={rows} columns={columns} />
              </div>
              <CustomButton label="Create" />
            </div>
          </CustomModal>
        )}
      </div>

      {SwitchedComponent?.()}
    </div>
  );
};
