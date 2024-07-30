import './globals.css';
import StoreProvider from '../store/store-provider';
import { CustomSnackbar } from '@/components/custom-snackbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <StoreProvider>
          <div className="bg-red">{children}</div>
          <CustomSnackbar />
        </StoreProvider>
      </body>
    </html>
  );
}
