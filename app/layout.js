import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
const font = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const metadata = { title: 'A medias · Divisor de gastos', description: 'Dividí gastos con amigos sin pelearte por las cuentas.' };
export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={font.className}>
        <header className="top"><a href="/" className="logo">A medias<span>.</span></a></header>
        <main>{children}</main>
      </body>
    </html>
  );
}
