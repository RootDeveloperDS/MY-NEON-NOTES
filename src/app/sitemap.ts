import type { MetadataRoute } from 'next';

import { SITE_DATA } from './metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_DATA.url;
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/status`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
