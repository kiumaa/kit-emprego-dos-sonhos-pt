import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Kit Emprego dos Sonhos — Portugal',
  description: 'Clareza para o próximo passo profissional. Diagnóstico de preparação e recursos práticos para candidaturas em Portugal.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={manrope.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Saltar para o conteúdo principal
        </a>
        <main id="main-content" style={{ flex: '1 0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
