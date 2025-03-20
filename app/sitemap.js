import { MetadataRoute } from 'next'
 
export default function sitemap() {
  return [
    {
      url: 'https://starglow.io',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://starglow.io/polls',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
}