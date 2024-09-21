import { CustomButton } from '../custom/custom-button';
import { ColumnsProps, CustomTable, RowsProps } from '../custom/custom-table';
import { useSetCompetitions } from '@/data/competitions/use-set-competitions';
import { useGetCompetitions } from '@/data/competitions/use-get-competitions';

type AdminColumnKeysProps =
  | 'INDEX'
  | 'COMPETITION'
  | 'TYPE'
  | 'TEAMS'
  | 'STATUS'
  | 'ACTIONS';

export const AdminTabCompetitions = () => {
  const { getCompetition } = useGetCompetitions();
  const { deleteCompetition } = useSetCompetitions();

  const rows: RowsProps<AdminColumnKeysProps> = getCompetition().map(
    ({ indexNo, name, type, teamsTotal, status, id }) => ({
      INDEX: indexNo,
      COMPETITION: name,
      TYPE: type,
      TEAMS: teamsTotal,
      STATUS: status,
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
