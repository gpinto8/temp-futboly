import { IMG_URLS } from '@/utils/img-urls';
import { Card, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from './custom/custom-button';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';

export const CompetitionsTab = () => {
  const { getCompetition } = useGetCompetitions();
  const { setActiveCompetition } = useSetCompetitions();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
      {getCompetition()?.map(
        (
          { startDateText, endDateText, usersTotal, name, id, active },
          index,
        ) => {
          return (
            <Card
              key={index + name}
              elevation={8}
              className={`max-w-[300px] rounded-xl ${active ? '-order-1' : ''}`}
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
                  <div>{usersTotal} users</div>
                  <CustomButton
                    className="mt-2"
                    label={active ? 'Selected' : 'Select'}
                    disabled={active}
                    handleClick={() => setActiveCompetition(id)}
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
