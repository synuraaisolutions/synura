import { NextResponse } from 'next/server'
import { allServices } from '@/data/services'
import { allCaseStudies } from '@/data/case-studies'

export async function GET() {
  const baseUrl = 'https://synura.ai'
  const currentDate = new Date().toISOString()

  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: '',
      lastModified: currentDate,
      changeFreq: 'weekly',
      priority: '1.0'
    },
    {
      url: '/about',
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/services',
      lastModified: currentDate,
      changeFreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/pricing',
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/case-studies',
      lastModified: currentDate,
      changeFreq: 'weekly',
      priority: '0.8'
    },
    {
      url: '/contact',
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/faqs',
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/roi-calculator',
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/privacy',
      lastModified: currentDate,
      changeFreq: 'yearly',
      priority: '0.3'
    },
    {
      url: '/terms',
      lastModified: currentDate,
      changeFreq: 'yearly',
      priority: '0.3'
    }
  ]

  // Dynamic service pages
  const servicePages = allServices.map(service => ({
    url: `/services/${service.slug}`,
    lastModified: currentDate,
    changeFreq: 'monthly',
    priority: '0.8'
  }))

  // Dynamic case study pages
  const caseStudyPages = allCaseStudies.map(caseStudy => ({
    url: `/case-studies/${caseStudy.slug}`,
    lastModified: caseStudy.publishedAt ? new Date(caseStudy.publishedAt).toISOString() : currentDate,
    changeFreq: 'monthly',
    priority: '0.7'
  }))

  // Combine all pages
  const allPages = [...staticPages, ...servicePages, ...caseStudyPages]

  // Generate XML sitemap
  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xmlSitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}