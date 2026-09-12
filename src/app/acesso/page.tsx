import { Suspense } from 'react';
import { AccessClient } from './access-client';

export const metadata = {
  title: 'Acesso aos Produtos — Kit Emprego dos Sonhos',
  description: 'Confirma o teu email de compra para acederes aos teus produtos e ferramentas.',
};

export default function AcessoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-secondary">A carregar portal de acesso...</div>}>
      <AccessClient />
    </Suspense>
  );
}
