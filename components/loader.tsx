import { CircularProgress } from '@mui/material';

export const Loader = () => {
  return (
    <CircularProgress
      variant="indeterminate"
      size={30}
      thickness={4}
      value={100}
      className="text-lightGray"
    />
  );
};
