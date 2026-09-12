import fs from 'fs';
import path from 'path';
import licoesData from '../../content/kit/licoes.json';

export interface LessonMeta {
  slug: string;
  title: string;
  order: number;
}

export interface LessonContent extends LessonMeta {
  markdown: string;
}

export function getAllLessons(): LessonMeta[] {
  return licoesData.lessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    order: l.order,
  }));
}

export function getLessonBySlug(slug: string): LessonContent | null {
  const lesson = licoesData.lessons.find((l) => l.slug === slug);
  if (!lesson) return null;

  try {
    const filePath = path.join(process.cwd(), 'content/kit/licoes', `${slug}.md`);
    const markdown = fs.readFileSync(filePath, 'utf-8');
    return {
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.order,
      markdown,
    };
  } catch {
    return null;
  }
}
