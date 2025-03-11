import { AuthProvider } from '@/lib/useAuth';
import './globals.css';

export const metadata = {
  title: 'FinNews Summarizer',
  description: 'Aplicación para resúmenes de noticias financieras',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}