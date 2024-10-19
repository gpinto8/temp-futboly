import { useState, useEffect } from 'react';
import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { useAppSelector } from '@/store/hooks';
import { MappedCompetitionsProps } from '@/firebase/db-types';

type AdminColumnKeysProps =
  | 'INDEX'
  | 'COMPETITION'
  | 'TYPE'
  | 'TEAMS'
  | 'STATUS'
  | 'ACTIONS';

export const AdminTabCompetitions = () => {
  const { getCompetitionsByLeagueId } = useGetCompetitions();
  const { deleteCompetition } = useSetCompetitions();
  const [competitions, setCompetitions] = useState<MappedCompetitionsProps[]>([]);
  const league = useAppSelector((state) => state.league);

  useEffect(() => {
    const fetchCompetitions = async (leagueId: string) => {
      const competitions = await getCompetitionsByLeagueId(leagueId);
      setCompetitions(competitions);
    };
    fetchCompetitions(league.id);
  }, [league]);

  const rows: RowsProps<AdminColumnKeysProps> = competitions.map(
    ({ name, specificPosition, teams, active, id }, index) => ({
      INDEX: index,
      COMPETITION: name,
      TYPE: specificPosition ? "Specific Position" : "General Position",
      TEAMS: teams.length,
      STATUS: active,
      ACTIONS: (
        <CustomButton
          label="Delete"
          style="error"
          className="w-1/4 h-1/4 md:w-2/4 md:h-2/4"
          handleClick={async () => await deleteCompetition(id)}
        />
      ),
    }),
  );

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Competition', id: 'COMPETITION', minWidth: 100 },
    { label: 'Type', id: 'TYPE', align: 'center', minWidth: 100 },
    { label: 'Teams', id: 'TEAMS', align: 'center', minWidth: 50 },
    { label: 'Status', id: 'STATUS', align: 'center', minWidth: 100 },
    { label: 'Actions', id: 'ACTIONS', align: 'center', minWidth: 100 },
  ];

  return (
    <div className="h-[400px]">
      <CustomTable<AdminColumnKeysProps>
        rows={rows}
        columns={columns}
        maxWidth={1000}
        elevation={0}
      />
    </div>
  );
};
