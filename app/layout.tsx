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
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex justify-center mx-4">{children}</div>
            <CustomSnackbar />
          </LocalizationProvider>
        </StoreProvider>
      </body>
    </html>
  );
};
