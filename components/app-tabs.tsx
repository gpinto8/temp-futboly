'use client';

import { createTheme, Tab, Tabs, ThemeProvider } from '@mui/material';
import { AdminTab } from './admin-tab/admin-tab';
import { useSwitchComponents } from '@/utils/switch-components';
import { StandingsTab } from './standings-tab';
import { CompetitionsTab } from './competitions-tab';
import { LiveMatch } from './live-match-tab';
import { Matches } from './matches-tab';
import { Teams } from './teams-tab';

export const AppTabs = () => {
  const {
    currentComponentId,
    components,
    setComponentId,
    SwitchedComponent,
    isCurrentId,
  } = useSwitchComponents([
    { label: 'Competitions', Component: () => <CompetitionsTab /> },
    { label: 'Standings', Component: () => <StandingsTab /> },
    { label: 'Teams', Component: () => <Teams /> },
    { label: 'Matches', Component: () => <Matches /> },
    { label: 'Live Match', Component: () => <LiveMatch/> },
    { label: 'Admin', Component: () => <AdminTab /> },
  ]);

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
          classes={{ scrollableX: 'md:flex md:justify-center' }}
          value={currentComponentId}
          textColor="primary"
          indicatorColor="primary"
          scrollButtons
          allowScrollButtonsMobile
          variant="scrollable"
        >
          {components.map(({ id, label }) => (
            <Tab
              className={`normal-case ${
                isCurrentId(id) ? 'text-main font-bold' : 'text-gray'
              }`}
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
