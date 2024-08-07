'use client';

import { createTheme, Tab, Tabs, ThemeProvider } from '@mui/material';
import './app-tabs.scss';
import { AdminTab } from './admin-tab';
import { useSwitchComponents } from '@/utils/switch-components';

export const AppTabs = () => {
  const { currentComponentId, components, setComponentId, SwitchedComponent, isCurrentId } =
    useSwitchComponents(
      [
        { label: 'Competitions', Component: AdminTab },
        { label: 'Standings', Component: AdminTab },
        { label: 'Teams', Component: AdminTab },
        { label: 'Matches', Component: AdminTab },
        { label: 'Live Match', Component: AdminTab },
        { label: 'Admin', Component: AdminTab },
      ],
      -1
    );

  const theme = createTheme({
    palette: {
      primary: {
        main: '#F03ED7',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col gap-8">
        <Tabs
          classes={{ scrollableX: 'flex justify-center' }}
          value={currentComponentId}
          textColor="primary"
          indicatorColor="primary"
          scrollButtons={true}
          allowScrollButtonsMobile
          variant="scrollable"
        >
          {components.map(({ id, label }) => (
            <Tab
              className={`normal-case ${isCurrentId(id) ? 'text-main font-bold' : 'text-gray'}`}
              key={id}
              value={id}
              label={label}
              onClick={() => setComponentId(id)}
            />
          ))}
        </Tabs>

        {SwitchedComponent?.()}
      </div>
    </ThemeProvider>
  );
};
