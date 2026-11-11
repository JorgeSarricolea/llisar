import { CONTACT_PHONE_E164, CONTACT_WA_URL } from './contact.js'

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
    title: 'Contacto | Hablar con Llisar por WhatsApp',
    description:
      '¿Qué se te escapa hoy en WhatsApp? Escríbenos al +52 999 187 2848. Base en Mérida, trabajo remoto para inmobiliaria y turismo.',
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

export function applyPageSeo(path) {
  const page = PAGES[path] || null
  if (!page) {
    document.title = 'Página no encontrada | Llisar'
    upsertMeta('name', 'robots', 'noindex, follow')
    upsertMeta('name', 'description', 'La página que buscas no existe en Llisar.')
    upsertLink('canonical', `${SITE_URL}/404.html`)
    return
  }

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
  upsertLink('canonical', url)
  upsertLink('alternate', url, { hreflang: SITE_LOCALE.replace('_', '-') })
  upsertLink('alternate', url, { hreflang: 'x-default' })

  upsertMeta('property', 'og:type', page.path === '/' ? 'website' : 'article')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:locale', SITE_LOCALE)
  upsertMeta('property', 'og:title', page.title)
  upsertMeta('property', 'og:description', page.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE)
  upsertMeta('property', 'og:image:secure_url', DEFAULT_OG_IMAGE)
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
    dateModified: '2026-11-11',
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

    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué hace un agente de IA de Llisar en WhatsApp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Contesta, califica y deja la visita o la reserva lista. También puede agendar en el calendario y registrar la fila en Excel o CRM.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Para quién es Llisar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para inmobiliarias y turismo que ya viven en WhatsApp, con pico de leads y procesos repetitivos que el equipo no alcanza a cubrir bien.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo empiezan a trabajar conmigo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Empezamos por cómo atiendes hoy. Luego el guion y el tono de tu marca, la conexión a calendario o CRM, y pruebas con mensajes reales.',
          },
        },
      ],
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
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.path === '/nosotros' ? 'Quiénes somos' : 'Contacto',
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
