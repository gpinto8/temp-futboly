'use client';

import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { errorActions } from '../../store/slices/error';

export const CustomSnackbar = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.error.message);

  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  const handleClose = async (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') return;

    dispatch(errorActions.setError({ message: '' }));
    await new Promise((resolve) => setTimeout(resolve, 1));
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          className="bg-error"
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
