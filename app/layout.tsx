'use client';

import './globals.css';
import StoreProvider from '../store/store-provider';
import { CustomSnackbar } from '@/components/custom/custom-snackbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body>
        <StoreProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex justify-center">{children}</div>
            <CustomSnackbar />
          </LocalizationProvider>
        </StoreProvider>
      </body>
    </html>
  );
};
