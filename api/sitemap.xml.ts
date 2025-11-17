import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const host = req.headers.host || 'fgblog.vercel.app'
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const baseUrl = `${protocol}://${host}`

    const currentDate = new Date().toISOString().split('T')[0]

    const staticRoutes = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: 'contact', priority: '0.8', changefreq: 'monthly' },
      { url: 'privacy', priority: '0.5', changefreq: 'yearly' },
      { url: 'terms', priority: '0.5', changefreq: 'yearly' }
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url ? '/' + route.url : ''}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate')
    return res.status(200).send(sitemap)
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return res.status(500).json({ error: 'Failed to generate sitemap' })
  }
}

