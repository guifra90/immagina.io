#!/usr/bin/env node

/**
 * SEO Generator
 * Descrizione: Genera automaticamente sitemap.xml, robots.txt, e metadata JSON-LD
 * Uso: node execution/generate_seo_files.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, '../frontend');
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public');

/**
 * Configurazione SEO
 */
const SEO_CONFIG = {
    siteUrl: 'https://immagina.io',
    siteName: 'Immagina.io',
    defaultTitle: 'Immagina.io | Design That Leaves a Mark',
    defaultDescription: 'AI-first development e strategic design per aziende che vogliono lasciare il segno.',
    language: 'it',
    locale: 'it_IT',
    twitter: '@immaginaio',
    email: 'hello@immagina.io',

    // Pagine del sito
    pages: [
        { url: '/', priority: 1.0, changefreq: 'monthly' },
        { url: '/#about', priority: 0.8, changefreq: 'monthly' },
        { url: '/#services', priority: 0.8, changefreq: 'monthly' },
        { url: '/#work', priority: 0.9, changefreq: 'weekly' },
        { url: '/#contact', priority: 0.7, changefreq: 'yearly' },
    ]
};

/**
 * Genera sitemap.xml
 */
function generateSitemap() {
    const { siteUrl, pages } = SEO_CONFIG;

    const urlEntries = pages.map(page => {
        const lastmod = new Date().toISOString().split('T')[0];
        return `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return sitemap;
}

/**
 * Genera robots.txt
 */
function generateRobots() {
    const { siteUrl } = SEO_CONFIG;

    return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml`;
}

/**
 * Genera structured data JSON-LD per Organization
 */
function generateStructuredData() {
    const { siteUrl, siteName, defaultDescription, email } = SEO_CONFIG;

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": siteName,
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": defaultDescription,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IT",
            "addressLocality": "Milano"
        },
        "sameAs": [
            "https://twitter.com/immaginaio",
            "https://linkedin.com/company/immaginaio"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "email": email,
            "contactType": "Customer Service"
        }
    };

    return JSON.stringify(organizationSchema, null, 2);
}

/**
 * Genera manifest.json per PWA
 */
function generateManifest() {
    const { siteName, defaultDescription } = SEO_CONFIG;

    const manifest = {
        "name": siteName,
        "short_name": "Immagina",
        "description": defaultDescription,
        "start_url": "/",
        "display": "standalone",
        "background_color": "#111111",
        "theme_color": "#E63946",
        "icons": [
            {
                "src": "/icon-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/icon-512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    };

    return JSON.stringify(manifest, null, 2);
}

/**
 * Genera meta tags template
 */
function generateMetaTemplate() {
    const { siteUrl, defaultTitle, defaultDescription, locale, twitter } = SEO_CONFIG;

    return `// SEO Metadata Template
// Copy this to your app/layout.js

export const metadata = {
  title: {
    default: '${defaultTitle}',
    template: '%s | Immagina.io'
  },
  description: '${defaultDescription}',
  keywords: ['web design', 'AI development', 'digital transformation', 'UX/UI design', 'software house'],
  authors: [{ name: 'Immagina.io' }],
  creator: 'Immagina.io',
  publisher: 'Immagina.io',
  
  openGraph: {
    type: 'website',
    locale: '${locale}',
    url: '${siteUrl}',
    siteName: 'Immagina.io',
    title: '${defaultTitle}',
    description: '${defaultDescription}',
    images: [
      {
        url: '${siteUrl}/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Immagina.io - Digital Design Agency'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: '${defaultTitle}',
    description: '${defaultDescription}',
    creator: '${twitter}',
    images: ['${siteUrl}/twitter-image.png']
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  manifest: '/manifest.json',
  
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
}`;
}

/**
 * Main function
 */
function generateSEOFiles() {
    try {
        console.log('🔍 Generating SEO files...\n');

        const files = [
            {
                name: 'sitemap.xml',
                content: generateSitemap(),
                path: path.join(PUBLIC_DIR, 'sitemap.xml')
            },
            {
                name: 'robots.txt',
                content: generateRobots(),
                path: path.join(PUBLIC_DIR, 'robots.txt')
            },
            {
                name: 'manifest.json',
                content: generateManifest(),
                path: path.join(PUBLIC_DIR, 'manifest.json')
            },
            {
                name: 'structured-data.json',
                content: generateStructuredData(),
                path: path.join(PUBLIC_DIR, 'structured-data.json')
            },
            {
                name: 'metadata-template.js',
                content: generateMetaTemplate(),
                path: path.join(__dirname, '../.tmp/metadata-template.js')
            }
        ];

        const results = [];

        files.forEach(({ name, content, path: filePath }) => {
            // Crea directory se non esiste
            const dir = dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Scrivi file
            fs.writeFileSync(filePath, content, 'utf8');

            console.log(`✅ ${name} generated`);
            results.push({ name, path: filePath });
        });

        console.log('\n📄 Files generated:');
        results.forEach(({ name, path }) => {
            console.log(`  - ${name}: ${path}`);
        });

        console.log('\n💡 Next steps:');
        console.log('  1. Copy metadata template to app/layout.js');
        console.log('  2. Create OG images (1200x630px) at public/og-image.png');
        console.log('  3. Create favicon and icons');
        console.log('  4. Submit sitemap to Google Search Console');

        return {
            success: true,
            data: { files: results }
        };

    } catch (error) {
        console.error('❌ Generation failed:', error.message);
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const result = generateSEOFiles();
    process.exit(result.success ? 0 : 1);
}

export { generateSEOFiles };
