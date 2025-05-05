import { useEffect } from 'react';
import { CustomCard } from '@/components/custom/custom-card';
import { PersonalMatch } from '@/components/tabs/matches-tab/personal-match';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CustomImage } from '@/components/custom/custom-image';
import { WeeklyMatches } from '@/components/tabs/matches-tab/weekly-matches';
import { TabSectionSpacer } from '../tab-section-spacer';
import { NoMatches } from './no-matches';
import { CompetitionFinishedMessage } from '@/components/message/competiton-finished-message';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';

export const Matches = ({
  personalMatchHistory,
  allMatchHistory,
  matchStatistics,
}) => {
  const { getActiveCompetition } = useGetCompetitions();
  const keys =
    matchStatistics &&
    Object.keys(matchStatistics).map((key) => {
      return { title: key, value: matchStatistics[key] };
    });
  personalMatchHistory =
    personalMatchHistory &&
    personalMatchHistory.map((match) => {
      return { ...match, date: new Date(match.date) };
    });

  const resizeAllMatches = () => {
    const personaleUpcomingMatches = document
      .getElementById('personaleUpcomingMatches')
      ?.querySelector('div');
    const personalHistoryMatches = document
      .getElementById('personalHistoryMatches')
      ?.querySelector('div');
    if (
      personalHistoryMatches?.clientHeight &&
      personalHistoryMatches?.style &&
      personaleUpcomingMatches?.clientHeight !==
        personalHistoryMatches?.clientHeight
    ) {
      personalHistoryMatches.style.height =
        personaleUpcomingMatches?.clientHeight + 'px';
    }
  };

  useEffect(() => {
    resizeAllMatches();
  }, []);

  function formatCardTitle(cardTitle) {
    switch (cardTitle) {
      case 'totalWins':
        return 'Total Wins';
      case 'totalMatchPlayed':
        return 'Total Match Played';
      case 'overallScore':
        return 'Overall Score';
      case 'scoredThisWeek':
        return 'Scored This Week';
      default:
        return cardTitle; // Return cardTitle if no option is met
    }
  }

  return (
    <>
      {getActiveCompetition()?.competitionFinished && (
        <CompetitionFinishedMessage />
      )}
      <TabSectionSpacer
        firstSection={{
          title: 'Your Matches',
          Component: () => (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10">
                <div id="personaleUpcomingMatches">
                  <h2 className="text-lg md:text-xl font-bold mb-4">
                    Upcoming Matches
                  </h2>
                  <div className="flex flex-col gap-2">
                    {personalMatchHistory
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .slice(0, 3)
                      .map((match, index) => {
                        return (
                          <PersonalMatch
                            key={index}
                            type="upcoming"
                            matchInfo={match}
                          />
                        );
                      })}
                  </div>
                </div>
                <div id="personalHistoryMatches">
                  <h2 className="text-lg md:text-xl font-bold mb-4">
                    All Matches
                  </h2>
                  <div className="flex flex-col overflow-y-auto main-scrollbar gap-2">
                    {personalMatchHistory
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((match, index) => {
                        return (
                          <PersonalMatch
                            key={index}
                            type={Boolean(match.result) ? 'past' : 'upcoming'}
                            matchInfo={match}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
              <div id="personalStatistics">
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  Match Statistics
                </h2>
                <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
                  {keys.map(({ title: cardTitle, value }, index) => {
                    return (
                      <CustomCard key={index} style="gray">
                        <h3 className="text-sm md:text-md font-medium text-gray-500">
                          {formatCardTitle(cardTitle)}
                        </h3>
                        <p className="text-md md:text-2xl font-medium text-center">
                          {isNaN(value) ? 0 : value}
                        </p>
                      </CustomCard>
                    );
                  })}
                </div>
              </div>
            </div>
          ),
        }}
        secondSection={{
          title: 'All Matches',
          Component: () => (
            <div className="border rounded-md shadow-lg">
              {allMatchHistory.map((weeklyMatches, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    aria-controls={'panel' + index + '-content'}
                    id={'panel' + index + '-header'}
                    expandIcon={
                      <CustomImage imageKey="EXPAND_ICON" className="h-5 w-5" />
                    }
                    className="bg-lightGray"
                  >
                    <div className="w-full grid grid-cols-2">
                      <p className="font-semibold">Week {weeklyMatches.week}</p>
                      <p className="font-semibold">
                        {
                          new Date(weeklyMatches.matches[0].date)
                            .toLocaleString()
                            .split(',')[0]
                        }
                      </p>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WeeklyMatches matches={weeklyMatches.matches} />
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          ),
        }}
        emptyMessage={{
          condition: !allMatchHistory?.length && !personalMatchHistory?.length,
          Component: () => <NoMatches />,
        }}
      />
    </>
  );
};
