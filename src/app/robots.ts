import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kit-emprego-dos-sonhos-pt.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/meu-kit/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
