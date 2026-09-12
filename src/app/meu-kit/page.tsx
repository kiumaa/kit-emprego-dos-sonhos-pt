import { Suspense } from 'react';
import { MeuKitClient } from './meu-kit-client';

export const metadata = {
  title: 'Meu Kit — Área de Trabalho e Ferramentas',
  description: 'Gere os teus produtos, sessões de trabalho e ficheiros guardados.',
};

export default function MeuKitPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-secondary">A carregar os teus produtos...</div>}>
      <MeuKitClient />
    </Suspense>
  );
}
