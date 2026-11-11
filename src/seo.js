import { CONTACT_PHONE_E164, CONTACT_WA_URL } from './contact.js'

export const SITE_URL = 'https://llisar.com'
export const SITE_NAME = 'Llisar'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/share.jpg`
export const DEFAULT_OG_ALT =
  'Llisar: agentes de IA en WhatsApp para inmobiliarias y turismo'

export const PAGES = {
  '/': {
    title: 'Agentes de IA en WhatsApp para inmobiliarias y turismo | Llisar',
    description:
      'Cuando llegan muchos leads o es fuera de horario, Llisar diseña agentes de IA en WhatsApp que califican, agendan y registran para inmobiliarias y turismo.',
    path: '/',
  },
  '/nosotros': {
    title: 'Nosotros | Llisar',
    description:
      'Llisar diseña agentes de IA en WhatsApp para inmobiliarias y turismo. Base en Mérida desde 2025, clientes en todo el mundo.',
    path: '/nosotros',
  },
  '/contacto': {
    title: 'Contacto | Hablar con Llisar',
    description:
      '¿Qué se te escapa hoy en WhatsApp? Escríbenos al +52 999 187 2848. Base en Mérida, trabajo remoto.',
    path: '/contacto',
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

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
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

export function applyPageSeo(path) {
  const page = PAGES[path] || null
  if (!page) {
    document.title = 'Página no encontrada | Llisar'
    upsertMeta('name', 'robots', 'noindex, follow')
    upsertMeta('name', 'description', 'La página que buscas no existe en Llisar.')
    return
  }

  const url = `${SITE_URL}${page.path === '/' ? '/' : page.path}`
  const robots = document.head.querySelector('meta[name="robots"]')
  if (robots) robots.remove()

  document.title = page.title
  upsertMeta('name', 'description', page.description)
  upsertMeta(
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )
  upsertMeta(
    'name',
    'keywords',
    'agentes de IA WhatsApp, WhatsApp business, inmobiliarias, turismo, consultoría IA, Llisar',
  )
  upsertLink('canonical', url)

  upsertMeta('property', 'og:type', page.path === '/' ? 'website' : 'article')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:locale', 'es_MX')
  upsertMeta('property', 'og:title', page.title)
  upsertMeta('property', 'og:description', page.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE)
  upsertMeta('property', 'og:image:type', 'image/jpeg')
  upsertMeta('property', 'og:image:width', '1200')
  upsertMeta('property', 'og:image:height', '630')
  upsertMeta('property', 'og:image:alt', DEFAULT_OG_ALT)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', page.title)
  upsertMeta('name', 'twitter:description', page.description)
  upsertMeta('name', 'twitter:image', DEFAULT_OG_IMAGE)
  upsertMeta('name', 'twitter:image:alt', DEFAULT_OG_ALT)

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Llisar diseña agentes de IA en WhatsApp para inmobiliarias y turismo.',
    logo: `${SITE_URL}/favicon.svg`,
    image: DEFAULT_OG_IMAGE,
    telephone: CONTACT_PHONE_E164,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE_E164,
      contactType: 'sales',
      availableLanguage: ['es', 'en'],
      url: CONTACT_WA_URL,
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'es-MX',
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
    inLanguage: 'es-MX',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: DEFAULT_OG_IMAGE,
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
      areaServed: 'MX',
      serviceType: 'Agentes de IA en WhatsApp',
      provider: { '@id': `${SITE_URL}/#organization` },
      image: DEFAULT_OG_IMAGE,
    })
  }

  if (page.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: SITE_URL + '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.path === '/nosotros' ? 'Nosotros' : 'Contacto',
          item: url,
        },
      ],
    })
  }

  upsertJsonLd('llisar-jsonld', {
    '@context': 'https://schema.org',
    '@graph': graph,
  })
}
