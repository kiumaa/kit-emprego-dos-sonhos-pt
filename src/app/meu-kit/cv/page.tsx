import { Suspense } from 'react';
import { CvEditorClient } from './cv-editor-client';

export const metadata = {
  title: 'Editor de Currículo — Meu Kit',
  description: 'Editor guiado de currículo passo a passo em formato A4.',
};

export default function CvEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-secondary">A carregar o editor...</div>}>
      <CvEditorClient />
    </Suspense>
  );
}
