import { tailwindColors } from '@/tailwind.config';
import { CircularProgress } from '@mui/material';

type LoaderProps = {
  color?: keyof typeof tailwindColors;
};

export const Loader = ({ color = 'lightGray' }: LoaderProps) => {
  return (
    <CircularProgress
      variant="indeterminate"
      size={30}
      thickness={4}
      value={100}
      className={`text-${color}`}
    />
  );
};
