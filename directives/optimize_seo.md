# Ottimizzazione SEO

## Obiettivo
Implementare best practices SEO per massimizzare la visibilità del sito nei motori di ricerca e sui social media.

## Input
- **Pagina/Sezione**: Quale pagina ottimizzare
- **Keywords Target**: Parole chiave principali
- **Content**: Titolo, descrizione, immagini

## Elementi SEO Fondamentali

### 1. Meta Tags Base

**In `app/layout.js`**:

```javascript
export const metadata = {
  title: {
    default: 'Immagina.io | Design That Leaves a Mark',
    template: '%s | Immagina.io'
  },
  description: 'Trasformiamo visioni in esperienze digitali intelligenti. AI-first development, strategic design, e soluzioni scalabili per aziende ambiziose.',
  keywords: ['web design', 'AI development', 'digital transformation', 'UX/UI design', 'software house'],
  authors: [{ name: 'Immagina.io' }],
  creator: 'Immagina.io',
  publisher: 'Immagina.io',
  
  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://immagina.io',
    siteName: 'Immagina.io',
    title: 'Immagina.io | Design That Leaves a Mark',
    description: 'AI-first development e strategic design per aziende che vogliono lasciare il segno.',
    images: [
      {
        url: 'https://immagina.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Immagina.io - Digital Design Agency'
      }
    ]
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Immagina.io | Design That Leaves a Mark',
    description: 'AI-first development e strategic design',
    creator: '@immaginaio',
    images: ['https://immagina.io/twitter-image.png']
  },
  
  // Verification
  verification: {
    google: 'google-site-verification-code',
    // yandex: 'yandex-verification',
    // bing: 'bing-verification'
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  
  // Robots
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
}
```

### 2. Structured Data (JSON-LD)

**Aggiungi schema.org markup**:

Crea `components/StructuredData.jsx`:

```javascript
export default function StructuredData() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Immagina.io",
        "url": "https://immagina.io",
        "logo": "https://immagina.io/logo.png",
        "description": "AI-first development e strategic design",
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
            "email": "hello@immagina.io",
            "contactType": "Customer Service"
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
    )
}
```

**Usa in layout**:
```javascript
import StructuredData from '../components/StructuredData'

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <StructuredData />
            </head>
            <body>{children}</body>
        </html>
    )
}
```

### 3. Sitemap

**Automatico con Next.js**:

Crea `app/sitemap.js`:

```javascript
export default function sitemap() {
    const baseUrl = 'https://immagina.io'
    
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/#about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/#services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/#work`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/#contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7,
        },
    ]
}
```

Next.js genera automaticamente `/sitemap.xml`

### 4. Robots.txt

Crea `app/robots.js`:

```javascript
export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'],
        },
        sitemap: 'https://immagina.io/sitemap.xml',
    }
}
```

### 5. Immagini OG (OpenGraph)

**Crea immagini social share**:

Dimensioni:
- **OpenGraph**: 1200x630px
- **Twitter**: 1200x600px

Contenuto:
- Logo Immagina.io
- Tagline: "Design That Leaves a Mark"
- Background con brand colors

**Posiziona in**:
- `public/og-image.png`
- `public/twitter-image.png`

### 6. Performance Optimization

**Next.js Image Optimization** (già gestito):
```jsx
import Image from 'next/image'

<Image
    src="/images/hero.png"
    alt="Descriptive alt text" // ⚠️ Importante per SEO
    width={1920}
    height={1080}
    priority // Per above-the-fold images
/>
```

**Lazy Loading**:
```jsx
<Image
    src="/images/below-fold.png"
    alt="Description"
    loading="lazy"
    width={800}
    height={600}
/>
```

### 7. Semantic HTML

**Usa tag appropriati**:

```jsx
// ✅ Good
<header>
    <nav>
        <ul>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h1>Main Title</h1>
        <section>
            <h2>Section Title</h2>
        </section>
    </article>
</main>

<footer>
    <address>Contact info</address>
</footer>

// ❌ Bad
<div className="header">
    <div className="nav">
```

### 8. Alt Text per Immagini

**Pattern**:
```jsx
// ✅ Descriptive
<Image 
    alt="Person wearing VR headset exploring digital transformation dashboard"
    src="/hero.png"
/>

// ❌ Generic
<Image 
    alt="Image"
    src="/hero.png"
/>
```

### 9. Internal Linking

**Link a sezioni**:
```jsx
<Link href="#services">Our Services</Link>
<Link href="#work">View Projects</Link>
```

**Link esterni con rel**:
```jsx
<a 
    href="https://example.com" 
    target="_blank" 
    rel="noopener noreferrer"
>
    External Link
</a>
```

### 10. Canonical URL

**Per evitare duplicate content**:

```javascript
// In metadata
export const metadata = {
    alternates: {
        canonical: 'https://immagina.io',
    },
}
```

## Checklist SEO

### Technical SEO
- [ ] Meta title (50-60 caratteri)
- [ ] Meta description (150-160 caratteri)
- [ ] OpenGraph tags
- [ ] Twitter Card tags
- [ ] Favicon configurato
- [ ] Sitemap.xml generato
- [ ] Robots.txt configurato
- [ ] Structured Data (JSON-LD)
- [ ] Canonical URL
- [ ] Mobile-friendly (responsive)
- [ ] HTTPS enabled
- [ ] Page speed > 80 (Lighthouse)

### Content SEO
- [ ] H1 presente e unico per pagina
- [ ] Heading hierarchy (H1 → H2 → H3)
- [ ] Alt text su tutte le immagini
- [ ] Internal links
- [ ] Keywords in title e description
- [ ] Content originale e di qualità

### Performance
- [ ] Core Web Vitals
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Images ottimizzate
- [ ] Lazy loading
- [ ] Minified CSS/JS

## Tools di Verifica

### Google Search Console
1. Vai su [search.google.com/search-console](https://search.google.com/search-console)
2. Aggiungi proprietà
3. Verifica ownership (via DNS o file HTML)
4. Invia sitemap

### Lighthouse Audit
```bash
npx lighthouse https://immagina.io --view
```

### Schema Validator
[validator.schema.org](https://validator.schema.org/)

## Monitoring

**Metrics da tracciare**:
1. **Organic Traffic** (Google Analytics)
2. **Keyword Rankings** (Google Search Console)
3. **Core Web Vitals** (PageSpeed Insights)
4. **Crawl Errors** (Search Console)
5. **Click-Through Rate** (Search Console)

## Casi Limite

### Meta Description Non Appare
**Sintomo**: Google mostra snippet diverso

**Soluzione**: Google sceglie autonomamente se la description non è rilevante. Rendi più specifica e keyword-rich.

### Immagini Non Indicizzate
**Sintomo**: Immagini non appaiono in Google Images

**Soluzione**:
- Aggiungi alt text
- Usa Image sitemap
- File names descrittivi (`hero-vr-design.png` vs `img001.png`)

### Duplicate Content
**Sintomo**: Google segnala contenuti duplicati

**Soluzione**: Usa canonical URLs

## Note

- **Italian Content**: Immagina.io è in italiano, usa `lang="it"` nel tag HTML
- **Local SEO**: Se targeting Milano/Italia, aggiungi schema LocalBusiness
- **Update Frequency**: Aggiorna sitemap quando aggiungi contenuti

## Riferimenti

- [Next.js SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
