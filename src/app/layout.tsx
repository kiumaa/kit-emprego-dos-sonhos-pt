import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="pt-PT">
      <head>
        {/* Fonte oficial Satoshi obtida via Fontshare */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
      </head>
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
