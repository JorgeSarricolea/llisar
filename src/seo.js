import { CONTACT_EMAIL, CONTACT_PHONE_E164, CONTACT_WA_URL } from './contact.js'
import { getAllPosts, getPostBySlug } from './blog/posts.js'

export const SITE_URL = 'https://llisar.com'
export const SITE_NAME = 'Llisar'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/share.jpg`
export const DEFAULT_OG_ALT =
  'Llisar: agentes de IA en WhatsApp para inmobiliarias y turismo'
export const SITE_LOCALE = 'es_MX'
export const SITE_LANGUAGE = 'es-MX'

export const PAGES = {
  '/': {
    title: 'Agentes de IA en WhatsApp para inmobiliarias y turismo | Llisar',
    description:
      'Agentes de IA en WhatsApp para inmobiliarias y turismo: contestan, califican y dejan la visita o la reserva lista, también fuera de horario.',
    path: '/',
  },
  '/nosotros': {
    title: 'Quiénes somos | Agentes de IA en WhatsApp · Llisar',
    description:
      'Llisar diseña agentes de IA en WhatsApp con la voz de tu marca. Base en Mérida desde 2025; inmobiliarias y turismo en todo el mundo.',
    path: '/nosotros',
  },
  '/contacto': {
    title: 'Contacto | Hablar con Llisar',
    description:
      'Escríbenos a hola@llisar.com o por WhatsApp al +52 999 187 2848. Base en Mérida, trabajo remoto para inmobiliaria y turismo.',
    path: '/contacto',
  },
  '/blog': {
    title: 'Guías WhatsApp inmobiliaria y turismo | Blog Llisar',
    description:
      'Guías prácticas para atender leads y huéspedes por WhatsApp: responder rápido, calificar, agendar visitas y evitar errores que enfrían la venta.',
    path: '/blog',
  },
}

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, attrs = {}) {
  const extra = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join('')
  let el = document.head.querySelector(`link[rel="${rel}"]${extra}`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function absoluteUrl(path) {
  if (path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path}`
}

function resolvePage(path) {
  if (PAGES[path]) return { kind: 'static', page: PAGES[path] }
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length).replace(/\/$/, '')
    const post = getPostBySlug(slug)
    if (!post) return null
    return {
      kind: 'post',
      page: {
        title: post.seoTitle || `${post.title} | Llisar`,
        description: post.description,
        path: post.path,
        keywords: post.keywords,
        date: post.date,
        readingTime: post.readingTime,
        articleTitle: post.title,
        coverImage: post.coverImage,
        coverImageAlt: post.coverImageAlt,
        wordCount: post.wordCount,
      },
      post,
    }
  }
  return null
}

export function applyPageSeo(path) {
  const resolved = resolvePage(path)
  if (!resolved) {
    document.title = 'Página no encontrada | Llisar'
    upsertMeta('name', 'robots', 'noindex, follow')
    upsertMeta('name', 'description', 'La página que buscas no existe en Llisar.')
    upsertLink('canonical', `${SITE_URL}/404.html`)
    return
  }

  const { page } = resolved
  const url = absoluteUrl(page.path)
  const robots = document.head.querySelector('meta[name="robots"]')
  if (robots) robots.remove()

  document.title = page.title
  upsertMeta('name', 'description', page.description)
  upsertMeta(
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )
  upsertMeta('name', 'author', SITE_NAME)
  if (page.keywords?.length) {
    upsertMeta('name', 'keywords', page.keywords.join(', '))
  }
  upsertLink('canonical', url)
  upsertLink('alternate', url, { hreflang: SITE_LOCALE.replace('_', '-') })
  upsertLink('alternate', url, { hreflang: 'x-default' })

  const ogType = resolved.kind === 'post' ? 'article' : page.path === '/' ? 'website' : 'article'
  const ogImage = page.coverImage
    ? absoluteUrl(page.coverImage)
    : DEFAULT_OG_IMAGE
  const ogAlt = page.coverImageAlt || DEFAULT_OG_ALT
  upsertMeta('property', 'og:type', ogType)
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:locale', SITE_LOCALE)
  upsertMeta('property', 'og:title', page.title)
  upsertMeta('property', 'og:description', page.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:image:secure_url', ogImage)
  upsertMeta('property', 'og:image:type', 'image/jpeg')
  upsertMeta('property', 'og:image:width', '1200')
  upsertMeta('property', 'og:image:height', '630')
  upsertMeta('property', 'og:image:alt', ogAlt)

  if (resolved.kind === 'post') {
    upsertMeta('property', 'article:published_time', `${page.date}T12:00:00-06:00`)
    upsertMeta('property', 'article:modified_time', `${page.date}T12:00:00-06:00`)
    upsertMeta('property', 'article:section', 'WhatsApp')
    if (page.keywords[0]) upsertMeta('property', 'article:tag', page.keywords[0])
  }

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', page.title)
  upsertMeta('name', 'twitter:description', page.description)
  upsertMeta('name', 'twitter:image', ogImage)
  upsertMeta('name', 'twitter:image:alt', ogAlt)

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Llisar diseña agentes de IA en WhatsApp para inmobiliarias y turismo.',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon.svg`,
    },
    image: DEFAULT_OG_IMAGE,
    telephone: CONTACT_PHONE_E164,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mérida',
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Mexico',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE_E164,
      email: CONTACT_EMAIL,
      contactType: 'sales',
      availableLanguage: ['es', 'en'],
      url: CONTACT_WA_URL,
    },
    email: CONTACT_EMAIL,
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': `${SITE_URL}/#organization` },
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: SITE_LANGUAGE,
    dateModified: page.date || '2026-11-11',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      width: 1200,
      height: 630,
    },
  }

  const graph = [organization, website, webpage]

  if (page.path === '/') {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: SITE_URL,
      description: page.description,
      areaServed: ['MX', 'Worldwide'],
      serviceType: [
        'Agentes de IA en WhatsApp',
        'Automatización para inmobiliarias',
        'Automatización para turismo',
      ],
      provider: { '@id': `${SITE_URL}/#organization` },
      image: DEFAULT_OG_IMAGE,
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: CONTACT_WA_URL,
        availableLanguage: ['es', 'en'],
      },
    })

  }

  if (page.path === '/blog') {
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${url}#collection`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      hasPart: getAllPosts().map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: absoluteUrl(p.path),
        datePublished: p.date,
        description: p.description,
      })),
    })
  }

  if (resolved.kind === 'post') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: page.articleTitle,
      description: page.description,
      datePublished: page.date,
      dateModified: page.date,
      inLanguage: SITE_LANGUAGE,
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
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
  }

  if (page.path !== '/') {
    const crumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${SITE_URL}/`,
      },
    ]

    const crumbName = {
      '/nosotros': 'Quiénes somos',
      '/contacto': 'Contacto',
      '/blog': 'Blog',
    }

    if (resolved.kind === 'post') {
      crumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      })
      crumbs.push({
        '@type': 'ListItem',
        position: 3,
        name: page.articleTitle,
        item: url,
      })
    } else {
      crumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: crumbName[page.path] || page.title,
        item: url,
      })
    }

    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs,
    })
  }

  upsertJsonLd('llisar-jsonld', {
    '@context': 'https://schema.org',
    '@graph': graph,
  })
}
