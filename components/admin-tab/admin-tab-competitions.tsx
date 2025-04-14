import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';
import { EmptyMessage } from '../empty-message';

type AdminColumnKeysProps =
  | 'INDEX'
  | 'COMPETITION'
  | 'TYPE'
  | 'TEAMS'
  | 'STATUS'
  | 'ACTIONS';

export const AdminTabCompetitions = () => {
  const { getCompetitions } = useGetCompetitions();
  const { deleteCompetition } = useSetCompetitions();

  const rows: RowsProps<AdminColumnKeysProps> = getCompetitions().map(
    ({ name, specificPosition, teams, active, id }, index) => ({
      INDEX: index + 1,
      COMPETITION: name,
      TYPE: specificPosition ? 'Specific Position' : 'General Position',
      TEAMS: teams.length,
      STATUS: active ? 'Started' : '-',
      ACTIONS: (
        <CustomButton
          label="Delete"
          style="error"
          className="w-2/4 h-2/4"
          handleClick={async () => await deleteCompetition(id)}
        />
      ),
    }),
  );

  const columns: ColumnsProps<AdminColumnKeysProps> = [
    { label: '#', id: 'INDEX', minWidth: 30 },
    { label: 'Competition', id: 'COMPETITION', minWidth: 150 },
    { label: 'Type', id: 'TYPE', minWidth: 175 },
    { label: 'Teams', id: 'TEAMS', align: 'center', minWidth: 50 },
    { label: 'Status', id: 'STATUS', align: 'center', minWidth: 100 },
    { label: 'Actions', id: 'ACTIONS', align: 'center', minWidth: 100 },
  ];

  return (
    <div className="h-[400px] flex justify-center w-full">
      {getCompetitions()?.length ? (
        <CustomTable<AdminColumnKeysProps>
          rows={rows}
          columns={columns}
          maxWidth={1000}
          elevation={0}
        />
      ) : (
        <EmptyMessage title="There are no competitions created yet." />
      )}
    </div>
  );
};
