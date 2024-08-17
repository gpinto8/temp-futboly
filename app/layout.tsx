import './globals.css';
import StoreProvider from '../store/store-provider';
import { CustomSnackbar } from '@/components/custom/custom-snackbar';

export default ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body>
        <StoreProvider>
          <div className="flex justify-center">{children}</div>
          <CustomSnackbar />
        </StoreProvider>
      </body>
    </html>
  );
};
