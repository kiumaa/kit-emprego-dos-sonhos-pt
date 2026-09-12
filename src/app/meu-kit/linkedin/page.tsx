import { Suspense } from 'react';
import { LinkedinClient } from './linkedin-client';

export const metadata = {
  title: 'LinkedIn dos Sonhos — Otimizador de Perfil & Abordagem',
  description: 'Construtor de perfil e mensagens diretas para recrutadores no LinkedIn em Portugal.',
};

export default function LinkedinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-secondary">A carregar o otimizador...</div>}>
      <LinkedinClient />
    </Suspense>
  );
}
