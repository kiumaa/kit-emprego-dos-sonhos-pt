import { Suspense } from 'react';
import { EntrevistaClient } from './entrevista-client';

export const metadata = {
  title: 'Entrevista dos Sonhos — Simulador STAR & Guião',
  description: 'Preparação prática para entrevistas de emprego em Portugal com o método STAR.',
};

export default function EntrevistaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-secondary">A carregar o simulador...</div>}>
      <EntrevistaClient />
    </Suspense>
  );
}
