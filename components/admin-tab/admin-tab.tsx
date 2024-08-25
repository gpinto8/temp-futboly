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
    { label: '#', id: 'INDEX', minWidth: 0 },
    { label: 'Team', id: 'TEAM', minWidth: 0 },
    { label: 'Owner', id: 'OWNER', minWidth: 0 },
    { label: 'Actions', id: 'ACTIONS', align: 'center', minWidth: 0 },
  ];

  return (
    <div
      className={`flex flex-col gap-8 ${
        currentComponentId === 'COMPETITIONS' ? 'max-w-[1000px]' : '' // Limiting the width so the "Add competition" button takes exactly the below table width and not the viewport one
      }`}
    >
      <div className="flex flex-col gap-6 justify-between md:flex-row">
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
          <CustomModal
            openButton={{ label: 'Add competition', className: '!w-[180px]' }}
            title="Create a new competition"
          >
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
