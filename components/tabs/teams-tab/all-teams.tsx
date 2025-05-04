import { CustomCard } from '@/components/custom/custom-card';
import { CustomSeparator } from '@/components/custom/custom-separator';
import {
  CompetitionsCollectionTeamsExtraProps,
  useGetTeams,
} from '@/data/teams/use-get-teams';
import { useEffect, useState } from 'react';
import { TeamCard } from './team-card';
import { CustomButton } from '@/components/custom/custom-button';
import {
  ColumnsProps,
  CustomTable,
  RowsProps,
} from '@/components/custom/custom-table';
import { CustomImage } from '@/components/custom/custom-image';
import { getCustomTeamLogoById } from '@/utils/real-team-logos';
import {
  getPlayerRating,
  getSportmonksPlayersDataByIds,
} from '@/sportmonks/common-methods';
import { Avatar } from '@mui/material';

type AllTeamsKeyProps = 'INDEX' | 'PLAYER' | 'POSITION' | 'RATING';

export const AllTeams = () => {
  const { getAllTeams, getTeam } = useGetTeams();

  const [allTeams, setAllTeams] = useState<
    CompetitionsCollectionTeamsExtraProps[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>();

  const [rows, setRows] = useState<RowsProps<AllTeamsKeyProps>>([]);
  const columns: ColumnsProps<AllTeamsKeyProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Player', id: 'PLAYER', minWidth: 150 },
    { label: 'Position', id: 'POSITION', minWidth: 100 },
    { label: 'Rating', id: 'RATING', minWidth: 50, align: 'center' },
  ];

  useEffect(() => {
    (async () => {
      const currentTeam = getTeam();
      const teams = await getAllTeams(true);

      if (currentTeam && teams?.length) {
        const filteredTeams = teams.filter(
          (team) => team.shortId !== currentTeam.shortId, // Exclude the current team since its already being shown in another component with more detail ..
        );
        setAllTeams(filteredTeams);
      }
    })();
  }, []);

  const handleCardSelection = async (
    team: CompetitionsCollectionTeamsExtraProps,
    index: number,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      setSelectedTeam(null);
    } else {
      setSelectedTeam(index);

      const playerIds = team.players.map((player) => player.sportmonksId);
      const playersData = await getSportmonksPlayersDataByIds(playerIds);

      const rows: RowsProps<AllTeamsKeyProps> = playersData.map(
        (player, i) => ({
          INDEX: i + 1,
          PLAYER: (
            <div className="flex gap-1">
              <Avatar
                src={player.image_path}
                alt={player.display_name}
                sx={{ width: 24, height: 24 }}
              />
              <span className="line-clamp-1">{player.display_name}</span>
            </div>
          ),
          POSITION: player?.position?.name,
          RATING: getPlayerRating(player.statistics),
        }),
      );
      setRows(rows);
    }
  };

  return allTeams?.length ? (
    <div className="grid lg:grid-cols-3 gap-4 auto-rows-fr">
      {allTeams.map((team, index) => {
        const isSelected = selectedTeam === index;
        return (
          <CustomCard
            key={index}
            style="gray"
            className={isSelected ? 'row-span-2' : ''}
          >
            <div
              className="flex flex-col justify-center items-start gap-4"
              onClick={() => handleCardSelection(team, index, isSelected)}
            >
              {/* TEAM OVERVIEW */}
              <div className="flex justify-start items-center gap-4 w-full">
                <CustomImage
                  forceSrc={getCustomTeamLogoById(team.logoId)?.src}
                  className="h-16 w-16"
                />
                <p className="text-2xl md:text-3xl">
                  <strong>{team.ownerUsername}</strong>
                  <span className="text-xl md:text-2xl">'s team:</span>
                </p>
              </div>
              <div className="flex flex-row gap-8 justify-start items-center">
                <TeamCard team={team} hideLogo />
              </div>

              {/* SHOW/HIDE BUTTON */}
              <CustomButton
                style="outlineBlack"
                label={isSelected ? 'Hide players' : 'Show players'}
                className="h-4 md:mx-auto px-8"
                suffixIconKey={isSelected ? 'COLLAPSE_ICON' : 'EXPAND_ICON'}
              />

              {/* PLAYERS TABLE */}
              {isSelected && (
                <div className="w-full h-[268px]">
                  <CustomSeparator withText={false} />
                  <CustomTable<AllTeamsKeyProps>
                    rows={rows}
                    columns={columns}
                    maxWidth={1000}
                    elevation={0}
                    hideBackground
                  />
                </div>
              )}
            </div>
          </CustomCard>
        );
      })}
    </div>
  ) : null;
};
