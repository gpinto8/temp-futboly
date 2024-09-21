import { tailwindColors } from '@/tailwind.config';
import { CircularProgress } from '@mui/material';

type LoaderProps = {
  color?: keyof typeof tailwindColors;
  size?: number;
};

export const Loader = ({ color = 'lightGray', size = 30 }: LoaderProps) => {
  return (
    <CircularProgress
      variant="indeterminate"
      size={size}
      thickness={4}
      value={100}
      className={`text-${color}`}
    />
  );
};
