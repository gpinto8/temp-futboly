import { Chip } from '@mui/material';
import { AdminTabUsers } from './admin-tab-users';
import { useSwitchComponents } from '@/utils/switch-components';
import { AdminTabTeams } from './admin-tab-teams';
import { AdminTabCompetitions } from './admin-tab-competitions';
import { AddCompetitionModal } from '../modal/add-competition-modal';

export const AdminTab = () => {
  const {
    components,
    setComponentId,
    SwitchedComponent,
    isCurrentId,
    currentComponentId,
  } = useSwitchComponents([
    { label: 'Teams', Component: () => <AdminTabTeams /> },
    { label: 'Competitions', Component: () => <AdminTabCompetitions /> },
    { label: 'Users', Component: () => <AdminTabUsers /> },
  ]);

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
              className={`${
                isCurrentId(id) ? 'text-white bg-main' : 'text-gray'
              }`}
              key={id}
              label={label}
              onClick={() => setComponentId(id)}
            />
          ))}
        </div>
        {currentComponentId === 'COMPETITIONS' && <AddCompetitionModal />}
      </div>

      {SwitchedComponent?.()}
    </div>
  );
};
