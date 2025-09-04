/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://motoplus.vercel.app',   
  generateRobotsTxt: true,                  
  sitemapSize: 5000,                        
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'],          
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://motoplus.vercel.app/sitemap-1.xml',
      'https://motoplus.vercel.app/sitemap-2.xml',
    ],
  },
}