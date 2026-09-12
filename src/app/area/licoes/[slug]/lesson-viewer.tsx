'use client';

import React, { useEffect, useState } from 'react';
import { LessonContent, LessonMeta } from '@/lib/lessons';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle2, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface LessonViewerProps {
  lesson: LessonContent;
  prevLesson: LessonMeta | null;
  nextLesson: LessonMeta | null;
  totalLessons: number;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  prevLesson,
  nextLesson,
  totalLessons,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('keds_completed_lessons');
      if (stored) {
        const list: string[] = JSON.parse(stored);
        setIsCompleted(list.includes(lesson.slug));
      }
    } catch {
      // Ignorar erro
    }
  }, [lesson.slug]);

  const toggleComplete = () => {
    try {
      const stored = localStorage.getItem('keds_completed_lessons');
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (isCompleted) {
        list = list.filter((s) => s !== lesson.slug);
        setIsCompleted(false);
      } else {
        if (!list.includes(lesson.slug)) list.push(lesson.slug);
        setIsCompleted(true);
      }
      localStorage.setItem('keds_completed_lessons', JSON.stringify(list));
    } catch {
      // Ignorar erro
    }
  };

  // Processamento simples das secções em Markdown
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = (key: string) => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p
            key={key}
            style={{
              fontSize: 'var(--type-body)',
              lineHeight: 1.6,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph(`p-${index}`);
        return;
      }

      if (trimmed.startsWith('# ')) {
        flushParagraph(`p-${index}`);
        // Title already handled in header
      } else if (trimmed.startsWith('## ')) {
        flushParagraph(`p-${index}`);
        const headingText = trimmed.replace('## ', '');
        elements.push(
          <h2
            key={`h2-${index}`}
            style={{
              fontSize: 'var(--type-h3)',
              fontWeight: 'var(--weight-semibold)',
              marginTop: 'var(--space-8)',
              marginBottom: 'var(--space-3)',
              color: 'var(--color-text)',
              borderBottom: '1px solid var(--color-surface)',
              paddingBottom: 'var(--space-2)',
            }}
          >
            {headingText}
          </h2>
        );
      } else {
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph(`p-final`);
    return elements;
  };

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto' }}>
      {/* Top Header */}
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
          Lição {lesson.order} de {totalLessons}
        </span>
        <button
          type="button"
          onClick={toggleComplete}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 14px',
            backgroundColor: isCompleted ? '#EBF6EE' : 'var(--color-surface)',
            color: isCompleted ? 'var(--color-success)' : 'var(--color-text-secondary)',
            border: `1px solid ${isCompleted ? 'var(--color-success)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-pill)',
            fontSize: 'var(--type-small)',
            fontWeight: 'var(--weight-medium)',
            cursor: 'pointer',
          }}
        >
          {isCompleted ? <Check size={16} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid currentColor' }} />}
          <span>{isCompleted ? 'Concluída' : 'Marcar como concluída'}</span>
        </button>
      </div>

      <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.15, marginBottom: 'var(--space-6)' }}>
        {lesson.title}
      </h1>

      {/* Lesson Content Card */}
      <article
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {renderMarkdown(lesson.markdown)}
      </article>

      {/* Completion & Next Lesson Footer */}
      <div
        style={{
          marginTop: 'var(--space-8)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        {prevLesson ? (
          <a
            href={`/area/licoes/${prevLesson.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--type-body)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              padding: '10px 16px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--color-border)',
            }}
          >
            <ArrowLeft size={18} />
            <span>Lição anterior</span>
          </a>
        ) : <div />}

        {nextLesson ? (
          <a
            href={`/area/licoes/${nextLesson.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--type-body)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-on-accent)',
              textDecoration: 'none',
              padding: '10px 20px',
              backgroundColor: 'var(--color-accent)',
              borderRadius: 'var(--radius-control)',
            }}
          >
            <span>Próxima lição: {nextLesson.title}</span>
            <ArrowRight size={18} />
          </a>
        ) : (
          <a
            href="/area"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--type-body)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-on-accent)',
              textDecoration: 'none',
              padding: '10px 20px',
              backgroundColor: 'var(--color-success)',
              borderRadius: 'var(--radius-control)',
            }}
          >
            <CheckCircle2 size={18} />
            <span>Concluir percurso</span>
          </a>
        )}
      </div>
    </div>
  );
};
