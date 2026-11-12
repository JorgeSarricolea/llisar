#!/usr/bin/env node
/**
 * Post-Vite SEO build: regenerates sitemap.xml and prerenders HTML shells
 * so each route ships title/description/canonical/OG/JSON-LD in the first HTML
 * (Google JS SEO: structured data in the initial response indexes faster).
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const contentDir = join(root, 'content/blog')
const SITE = 'https://llisar.com'
const TODAY = '2026-11-11'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw.trim() }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      value = value.replace(/^["']|["']$/g, '')
    }
    meta[key] = value
  }
  return { meta, body: match[2].trim() }
}

function loadPosts() {
  return readdirSync(contentDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { meta, body } = parseFrontmatter(
        readFileSync(join(contentDir, f), 'utf8'),
      )
      return {
        slug: meta.slug,
        title: meta.title,
        seoTitle: meta.seoTitle || `${meta.title} | Llisar`,
        description: meta.description,
        date: meta.date,
        keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
        readingTime: meta.readingTime || '6 min',
        coverImage: meta.coverImage || '',
        coverImageAlt: meta.coverImageAlt || meta.title,
        path: `/blog/${meta.slug}`,
        wordCount: body.trim().split(/\s+/).filter(Boolean).length,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

const STATIC = [
  {
    path: '/',
    title: 'Agentes de IA en WhatsApp para inmobiliarias y turismo | Llisar',
    description:
      'Agentes de IA en WhatsApp para inmobiliarias y turismo: contestan, califican y dejan la visita o la reserva lista, también fuera de horario.',
    date: TODAY,
    ogType: 'website',
  },
  {
    path: '/nosotros',
    title: 'Quiénes somos | Agentes de IA en WhatsApp · Llisar',
    description:
      'Llisar diseña agentes de IA en WhatsApp con la voz de tu marca. Base en Mérida desde 2025; inmobiliarias y turismo en todo el mundo.',
    date: TODAY,
    ogType: 'article',
  },
  {
    path: '/contacto',
    title: 'Contacto | Hablar con Llisar',
    description:
      'Escríbenos a hola@llisar.com o por WhatsApp al +52 999 187 2848. Base en Mérida, trabajo remoto para inmobiliaria y turismo.',
    date: TODAY,
    ogType: 'article',
  },
  {
    path: '/blog',
    title: 'Guías WhatsApp inmobiliaria y turismo | Blog Llisar',
    description:
      'Guías prácticas para atender leads y huéspedes por WhatsApp: responder rápido, calificar, agendar visitas y evitar errores que enfrían la venta.',
    date: TODAY,
    ogType: 'website',
  },
]

function abs(path) {
  return path === '/' ? `${SITE}/` : `${SITE}${path}`
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildJsonLd(page, posts) {
  const url = abs(page.path)
  const ogImage = page.coverImage
    ? abs(page.coverImage)
    : `${SITE}/share.jpg`
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'Llisar',
    url: SITE,
    description:
      'Llisar diseña agentes de IA en WhatsApp para inmobiliarias y turismo.',
    logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
    image: `${SITE}/share.jpg`,
    telephone: '+529991872848',
    email: 'hola@llisar.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mérida',
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    },
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'Llisar',
    inLanguage: 'es-MX',
    publisher: { '@id': `${SITE}/#organization` },
  }
  const webpage = {
    '@type': page.kind === 'post' ? 'BlogPosting' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${SITE}/#website` },
    inLanguage: 'es-MX',
    dateModified: page.date,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      width: 1200,
      height: 630,
    },
  }

  const graph = [organization, website]

  if (page.kind === 'post') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: page.headline,
      description: page.description,
      datePublished: page.date,
      dateModified: page.date,
      inLanguage: 'es-MX',
      author: { '@id': `${SITE}/#organization` },
      publisher: { '@id': `${SITE}/#organization` },
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image: {
        '@type': 'ImageObject',
        url: ogImage,
        width: 1200,
        height: 630,
      },
      keywords: page.keywords.join(', '),
      wordCount: page.wordCount,
      timeRequired: `PT${parseInt(page.readingTime, 10) || 6}M`,
    })
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: page.headline, item: url },
      ],
    })
  } else {
    graph.push(webpage)
    if (page.path === '/blog') {
      graph.push({
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name: page.title,
        description: page.description,
        hasPart: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: abs(p.path),
          datePublished: p.date,
          description: p.description,
        })),
      })
    }
    if (page.path !== '/') {
      const names = {
        '/nosotros': 'Quiénes somos',
        '/contacto': 'Contacto',
        '/blog': 'Blog',
      }
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: names[page.path] || page.title,
            item: url,
          },
        ],
      })
    }
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

function patchHtml(template, page, posts) {
  const url = abs(page.path)
  const ogImage = page.coverImage
    ? abs(page.coverImage)
    : `${SITE}/share.jpg`
  const ogAlt = page.coverImageAlt || 'Llisar: agentes de IA en WhatsApp'
  const ogType = page.ogType || (page.kind === 'post' ? 'article' : 'website')
  const jsonLd = JSON.stringify(buildJsonLd(page, posts))

  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
  )
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`,
  )
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="es-MX"\s+href="[^"]*"\s*\/>/,
    `<link rel="alternate" hreflang="es-MX" href="${url}" />`,
  )
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/>/,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${ogType}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${ogImage}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:secure_url" content="${ogImage}" />`,
  )
  html = html.replace(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeHtml(ogAlt)}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${ogImage}" />`,
  )
  html = html.replace(
    /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image:alt" content="${escapeHtml(ogAlt)}" />`,
  )

  if (page.keywords?.length) {
    const kw = `<meta name="keywords" content="${escapeHtml(page.keywords.join(', '))}" />\n    `
    if (!html.includes('name="keywords"')) {
      html = html.replace(
        '<meta name="author" content="Llisar" />',
        `<meta name="author" content="Llisar" />\n    ${kw}`,
      )
    }
  }

  if (page.kind === 'post') {
    const articleMeta = `
    <meta property="article:published_time" content="${page.date}T12:00:00-06:00" />
    <meta property="article:modified_time" content="${page.date}T12:00:00-06:00" />
    <meta property="article:section" content="WhatsApp" />
    <meta property="article:author" content="Llisar" />`
    html = html.replace('</title>', `</title>${articleMeta}`)
  }

  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="llisar-jsonld">${jsonLd}</script>`,
  )

  return html
}

function writeRoute(html, routePath) {
  if (routePath === '/') {
    writeFileSync(join(dist, 'index.html'), html)
    return
  }
  // Directory index ( /path/ ) + flat .html ( /path ) so Netlify Pretty URLs
  // and no-slash canonicals both get the prerendered head, not the SPA shell.
  const rel = routePath.replace(/^\//, '')
  const dir = join(dist, rel)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  writeFileSync(join(dist, `${rel}.html`), html)
}

function writeSitemap(posts) {
  const urls = [
    ...STATIC.map((p) => ({ loc: abs(p.path), lastmod: p.date, images: [] })),
    ...posts.map((p) => ({
      loc: abs(p.path),
      lastmod: p.date,
      images: p.coverImage
        ? [{ loc: abs(p.coverImage), title: p.title, caption: p.coverImageAlt }]
        : [],
    })),
  ]

  const body = urls
    .map((u) => {
      const images = u.images
        .map(
          (img) => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${escapeHtml(img.title)}</image:title>
      <image:caption>${escapeHtml(img.caption)}</image:caption>
    </image:image>`,
        )
        .join('')
      return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>${images}
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`
  writeFileSync(join(dist, 'sitemap.xml'), xml)
  writeFileSync(join(root, 'public/sitemap.xml'), xml)
}

const posts = loadPosts()
const template = readFileSync(join(dist, 'index.html'), 'utf8')

for (const page of STATIC) {
  writeRoute(patchHtml(template, page, posts), page.path)
}

for (const post of posts) {
  writeRoute(
    patchHtml(
      template,
      {
        kind: 'post',
        path: post.path,
        title: post.seoTitle,
        headline: post.title,
        description: post.description,
        date: post.date,
        keywords: post.keywords,
        readingTime: post.readingTime,
        coverImage: post.coverImage,
        coverImageAlt: post.coverImageAlt,
        wordCount: post.wordCount,
        ogType: 'article',
      },
      posts,
    ),
    post.path,
  )
}

writeSitemap(posts)

console.log(
  `SEO build: ${STATIC.length} pages + ${posts.length} posts prerendered; sitemap written.`,
)
