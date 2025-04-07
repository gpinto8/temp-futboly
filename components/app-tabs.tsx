'use client';

import { createTheme, Tab, Tabs, ThemeProvider } from '@mui/material';
import { AdminTab } from './admin-tab/admin-tab';
import { useSwitchComponents } from '@/utils/switch-components';
import { StandingsTab } from './standings-tab';
import { CompetitionsTab } from './competitions-tab';
import { LiveMatch } from './live-match-tab';
import { MatchesTab } from './matches-tab';
import { TeamsTab } from './teams-tab';
import { useGetLeagues } from '@/data/leagues/use-get-leagues';
import { useEffect, useState } from 'react';
import { useTabContext } from '@/utils/tab-context';

export const AppTabs = () => {
  const { isUserLeagueOwner } = useGetLeagues();
    const { currentTab, setCurrentTab } = useTabContext();

  const [tabComponents, setTabComponents] = useState([
    { label: 'Competitions', Component: () => <CompetitionsTab /> },
    { label: 'Standings', Component: () => <StandingsTab /> },
    { label: 'Teams', Component: () => <TeamsTab /> },
    { label: 'Matches', Component: () => <MatchesTab /> },
    { label: 'Live Match', Component: () => <LiveMatch /> },
  ]);

  const isUserOwner = isUserLeagueOwner();
  useEffect(() => {
    if (isUserOwner && tabComponents.filter((el) => el.label === "Admin").length === 0) {
      setTabComponents([
        ...tabComponents,
        { label: 'Admin', Component: () => <AdminTab /> },
      ]);
    }
  }, [isUserOwner]);

    const {
  components,
  currentComponentId,
  setComponentId,
  SwitchedComponent,
  isCurrentId,
} = useSwitchComponents(tabComponents, currentTab);

    useEffect(() => {
  setCurrentTab(currentComponentId.toUpperCase());  // Forza la maiuscola
}, [currentComponentId]);

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
          value={currentComponentId.toUpperCase()}
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
              onClick={() => {setComponentId(id); setCurrentTab(id);}}
            />
          ))}
        </Tabs>

        {SwitchedComponent?.()}
      </div>
    </ThemeProvider>
  );
};
