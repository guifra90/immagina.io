# Creazione Blog Post

## Obiettivo
Standardizzare la creazione di articoli blog per il sito Immagina.io, con SEO optimization e design coerente.

## Input
- **Titolo**: Titolo dell'articolo
- **Slug**: URL-friendly slug (es: `ai-native-development`)
- **Categoria**: (Tech, Design, Case Study, Tutorial)
- **Autore**: Nome autore
- **Excerpt**: Sommario breve (150-160 char per SEO)
- **Immagine Hero**: Path o descrizione per generare
- **Contenuto**: Markdown content

## Quando Usare
- Pubblicare case study di progetti
- Tutorial tecnici
- Riflessioni su design/AI
- News aziendali

---

## Struttura Blog

### Directory Structure

```
frontend/
├── app/
│   ├── blog/
│   │   ├── page.jsx               # Lista blog posts
│   │   ├── [slug]/
│   │   │   └── page.jsx          # Post singolo
│   │   └── layout.jsx            # Layout blog
│   └── ...
├── content/
│   └── blog/
│       ├── ai-native-development.mdx
│       ├── case-study-neural-core.mdx
│       └── ...
└── public/
    └── images/
        └── blog/
            ├── ai-native-hero.png
            └── ...
```

---

## Setup Blog (Prima Volta)

### 1. Install Dependencies

```bash
cd frontend
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter
npm install rehype-highlight remark-gfm
```

### 2. Configure next.config.js

```javascript
// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [require('rehype-highlight')],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx'],
})
```

### 3. Create Blog List Page

```javascript
// app/blog/page.jsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Blog | Immagina.io',
  description: 'Insights su AI, design e tecnologia'
}

function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  const filenames = fs.readdirSync(postsDirectory)
  
  const posts = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      slug: filename.replace('.mdx', ''),
      ...data
    }
  })
  
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export default function BlogPage() {
  const posts = getBlogPosts()
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <h1 className="text-6xl font-display font-bold uppercase mb-12">
          Blog
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary transition-colors">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <span className="text-xs uppercase tracking-widest text-primary">
                    {post.category}
                  </span>
                  <h2 className="text-2xl font-bold mt-2 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-muted mb-4">
                    {post.excerpt}
                  </p>
                  <time className="text-sm text-muted">
                    {new Date(post.date).toLocaleDateString('it-IT')}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 4. Create Single Post Page

```javascript
// app/blog/[slug]/page.jsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/blog')
  const filenames = fs.readdirSync(postsDirectory)
  
  return filenames.map(filename => ({
    slug: filename.replace('.mdx', '')
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)
  
  return {
    title: `${data.title} | Immagina.io Blog`,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: [data.image],
      type: 'article',
      publishedTime: data.date,
      authors: [data.author]
    }
  }
}

export default async function BlogPost({ params }) {
  const { slug } = params
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return (
    <article className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Hero */}
        <header className="mb-12">
          <span className="text-sm uppercase tracking-widest text-primary">
            {data.category}
          </span>
          <h1 className="text-6xl font-display font-bold uppercase my-4">
            {data.title}
          </h1>
          <div className="flex items-center gap-4 text-muted">
            <span>{data.author}</span>
            <span>•</span>
            <time>{new Date(data.date).toLocaleDateString('it-IT')}</time>
          </div>
        </header>
        
        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>
    </article>
  )
}
```

---

## Template Blog Post

### File: `content/blog/template.mdx`

```markdown
---
title: "Titolo del Post"
slug: "url-friendly-slug"
date: "2026-01-30"
author: "Nome Autore"
category: "Tech"
excerpt: "Breve descrizione del post per SEO e preview. Massimo 160 caratteri."
image: "/images/blog/post-hero.png"
tags: ["AI", "Design", "Development"]
---

## Introduzione

Paragrafo introduttivo che spiega il contesto e cattura l'attenzione.

## Sezione 1

Contenuto principale con sottosezioni.

### Sottosezione

Dettagli specifici.

```javascript
// Blocchi di codice supportati
const example = "Hello World";
```

## Sezione 2

Continua il contenuto.

![Alt text](/images/blog/inline-image.png)

## Conclusione

Riassunto e call-to-action.

---

**Keywords**: AI, Design, Development
```

---

## Styling con Tailwind Typography

```bash
npm install @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      typography: {
        invert: {
          css: {
            '--tw-prose-body': 'rgb(168, 168, 168)',
            '--tw-prose-headings': 'rgb(255, 255, 255)',
            '--tw-prose-links': '#E63946',
            '--tw-prose-code': 'rgb(255, 255, 255)',
            '--tw-prose-pre-bg': 'rgb(17, 17, 17)',
          }
        }
      }
    }
  }
}
```

---

## Custom MDX Components

```javascript
// components/mdx-components.jsx
import Image from 'next/image'

export const mdxComponents = {
  h2: ({ children }) => (
    <h2 className="text-4xl font-display font-bold uppercase mt-12 mb-6">
      {children}
    </h2>
  ),
  
  img: ({ src, alt }) => (
    <div className="relative h-96 my-8 rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  ),
  
  code: ({ children }) => (
    <code className="bg-white/5 px-2 py-1 rounded text-sm">
      {children}
    </code>
  ),
}

// Usa in MDXRemote
<MDXRemote source={content} components={mdxComponents} />
```

---

## SEO Optimization

### Metadata per Ogni Post

```javascript
export async function generateMetadata({ params }) {
  const data = getPostData(params.slug)
  
  return {
    title: data.title,
    description: data.excerpt,
    keywords: data.tags,
    
    openGraph: {
      type: 'article',
      title: data.title,
      description: data.excerpt,
      images: [data.image],
      publishedTime: data.date,
      authors: [data.author],
      tags: data.tags
    },
    
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt,
      images: [data.image]
    },
    
    alternates: {
      canonical: `https://immagina.io/blog/${params.slug}`
    }
  }
}
```

### Structured Data per Blog Post

```javascript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": data.title,
  "image": data.image,
  "datePublished": data.date,
  "author": {
    "@type": "Person",
    "name": data.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Immagina.io",
    "logo": {
      "@type": "ImageObject",
      "url": "https://immagina.io/logo.png"
    }
  },
  "description": data.excerpt
}

// Aggiungi al post
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>
```

---

## Checklist Nuovo Post

- [ ] Crea file `.mdx` in `content/blog/`
- [ ] Frontmatter completo (title, date, author, excerpt, image, tags)
- [ ] Hero image generata/preparata (1200x630px)
- [ ] Contenuto scritto in Markdown
- [ ] Code blocks con syntax highlight
- [ ] Immagini inline ottimizzate
- [ ] SEO: excerpt < 160 char
- [ ] Tags rilevanti
- [ ] Slug URL-friendly
- [ ] Preview locale (`npm run dev`)
- [ ] Commit e deploy

---

## Best Practices

### Writing
- **Hook iniziale**: Cattura attenzione nei primi 100 caratteri
- **Paragraphs brevi**: Max 3-4 righe per paragrafo
- **Headers strutturati**: H2 per sezioni, H3 per sottosezioni
- **Esempi concreti**: Code snippets, screenshots
- **Call-to-action**: Chiudi con next step o domanda

### SEO
- **Keywords natural**: No keyword stuffing
- **Internal links**: Link ad altri post/pagine
- **Alt text immagini**: Descrittivo e keyword-rich
- **Meta description**: 150-160 caratteri, compelling

### Images
- **Hero**: 1200x630px (Open Graph standard)
- **Inline**: Max 1200px width
- **Format**: WebP quando possibile
- **Optimization**: Comprimi con Sharp/TinyPNG

---

## Riferimenti

- [MDX Documentation](https://mdxjs.com/)
- [Next.js Blog Tutorial](https://nextjs.org/learn/basics/create-nextjs-app)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
