import React from 'react';
import { notFound } from 'next/navigation';
import { getLessonBySlug, getAllLessons } from '@/lib/lessons';
import { LessonViewer } from './lesson-viewer';

export function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  const allLessons = getAllLessons();

  if (!lesson) {
    notFound();
  }

  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <LessonViewer
      lesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      totalLessons={allLessons.length}
    />
  );
}
