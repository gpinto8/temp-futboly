import { useEffect, useState } from 'react';
import { IMG_URLS } from '@/utils/img-urls';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from './custom/custom-button';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { useAppSelector } from '@/store/hooks';
import { UsersCollectionProps, MappedCompetitionsProps } from '@/firebase/db-types';

export const CompetitionsTab = () => {
  const user: UsersCollectionProps = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.league);
  const { getCompetitionsByUid, getActiveCompetitionByUid } = useGetCompetitions();
  const { setActiveCompetition } = useSetCompetitions();
  const [competitions, setCompetitions] = useState<MappedCompetitionsProps[] | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const getCompetitions = async () => {
    const competitions = await getCompetitionsByUid(league.id, user.id);
    return competitions ? competitions as MappedCompetitionsProps[] : null;
  };

  useEffect(() => {
    const fetchCompetitions = async () => {
      const competitions = await getCompetitions();
      setCompetitions(competitions);
    };

    const fetchActiveElement = async () => {
      const activeCompetition = await getActiveCompetitionByUid(league.id, user);
      if (activeCompetition) {  // If null it means the user is not in any competition
        if (!user.activeCompetitions || !user.activeCompetitions[league.id]) setActiveCompetition(activeCompetition.id, user, league.id, activeCompetition);  // It means that the user didn't have an active one for this league so I am setting the first one it found
        setActiveElement(activeCompetition.id);
      }
    };

    if (user && league) {
      fetchCompetitions();
      fetchActiveElement();
    }
  }, [league]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
      { competitions?.map((competition: MappedCompetitionsProps, index: number) => {
          const { startDateText, endDateText, players, name, id } = competition;
          const activeNode = activeElement === id;
          return (
            <Card
              key={index + name}
              elevation={8}
              className={`max-w-[300px] rounded-xl ${activeNode ? '-order-1' : ''}`}
            >
              <CardMedia
                className="h-40"
                image={IMG_URLS.LOGIN_ILLUSTRATION.src}
                title={IMG_URLS.LOGIN_ILLUSTRATION.alt}
              />
              <CardContent>
                <div className="flex flex-col gap-2 items-center">
                  <div className="font-bold">{name}</div>
                  <div>
                    {startDateText} - {endDateText}
                  </div>
                  <div>{players.length} users</div>
                  <CustomButton
                    className="mt-2"
                    label={activeNode ? 'Active' : 'Select'}
                    disabled={activeNode}
                    handleClick={() => {
                      setActiveCompetition(id, user, league.id, competition);
                      setActiveElement(id);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        },
      )}
    </div>
  );
};
