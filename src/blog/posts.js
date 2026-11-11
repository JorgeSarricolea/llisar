import {
  estimateReadingTime,
  markdownToHtml,
  parseFrontmatter,
} from './markdown.js'

import postAtender from '../../content/blog/como-atender-leads-inmobiliaria-whatsapp.md?raw'
import postTurismo from '../../content/blog/agente-ia-whatsapp-turismo-cuando-conviene.md?raw'
import postCalificar from '../../content/blog/calificar-leads-inmobiliarios-whatsapp.md?raw'
import postAgendar from '../../content/blog/agendar-visitas-desde-whatsapp.md?raw'
import postErrores from '../../content/blog/errores-atencion-whatsapp-inmobiliaria-turismo.md?raw'

const RAW_POSTS = [
  postAtender,
  postTurismo,
  postCalificar,
  postAgendar,
  postErrores,
]

function buildPost(raw) {
  const { meta, body } = parseFrontmatter(raw)
  const slug = meta.slug
  if (!slug) throw new Error(`Blog post missing slug: ${meta.title || 'unknown'}`)
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length
  return {
    slug,
    title: meta.title || 'Sin título',
    seoTitle: meta.seoTitle || `${meta.title || 'Sin título'} | Llisar`,
    description: meta.description || '',
    date: meta.date || '2026-11-11',
    keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
    readingTime: meta.readingTime || estimateReadingTime(body),
    coverImage: meta.coverImage || '',
    coverImageAlt: meta.coverImageAlt || meta.title || '',
    wordCount,
    path: `/blog/${slug}`,
    body,
    html: markdownToHtml(body),
  }
}

const POSTS = RAW_POSTS.map(buildPost).sort((a, b) =>
  a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
)

export function getAllPosts() {
  return POSTS
}

export function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug) || null
}

export function getRelatedPosts(slug, limit = 3) {
  return POSTS.filter((p) => p.slug !== slug).slice(0, limit)
}

export function formatPostDate(iso) {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}
