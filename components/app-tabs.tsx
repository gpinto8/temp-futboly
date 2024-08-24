'use client';

import { createTheme, Tab, Tabs, ThemeProvider } from '@mui/material';
import { AdminTab } from './admin-tab/admin-tab';
import { useSwitchComponents } from '@/utils/switch-components';
import { StandingsTab } from './standings-tab';
import { CompetitionsTab } from './competitions-tab';
import { LiveMatchTab } from './tabs/live-match-tab/live-match-tab';

export const AppTabs = () => {
  const { currentComponentId, components, setComponentId, SwitchedComponent, isCurrentId } =
    useSwitchComponents(
      [
        { label: 'Competitions', Component: CompetitionsTab },
        { label: 'Standings', Component: StandingsTab },
        { label: 'Teams', Component: AdminTab },
        { label: 'Matches', Component: AdminTab },
        { label: 'Live Match', Component: LiveMatchTab },
        { label: 'Admin', Component: AdminTab },
      ],
      1
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
