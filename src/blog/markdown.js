function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(text) {
  let out = escapeHtml(text)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, href) => {
      const safeHref = href.startsWith('/') || href.startsWith('https://') || href.startsWith('http://') || href.startsWith('#')
        ? href
        : '#'
      const external = safeHref.startsWith('http')
      const rel = external ? ' rel="noopener noreferrer"' : ''
      const target = external ? ' target="_blank"' : ''
      return `<a href="${safeHref}"${target}${rel}>${label}</a>`
    },
  )
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  return out
}

export function parseFrontmatter(raw) {
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
      if (value === 'true') value = true
      if (value === 'false') value = false
    }
    meta[key] = value
  }

  return { meta, body: match[2].trim() }
}

export function markdownToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const html = []
  let i = 0
  let paragraph = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    html.push(`<p>${inline(paragraph.join(' '))}</p>`)
    paragraph = []
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      i += 1
      continue
    }

    if (trimmed === '---') {
      flushParagraph()
      html.push('<hr />')
      i += 1
      continue
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^[-*]\s+/, ''))}</li>`)
        i += 1
      }
      html.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph()
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`)
        i += 1
      }
      html.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph()
      const quotes = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quotes.push(inline(lines[i].trim().replace(/^>\s+/, '')))
        i += 1
      }
      html.push(`<blockquote><p>${quotes.join(' ')}</p></blockquote>`)
      continue
    }

    paragraph.push(trimmed)
    i += 1
  }

  flushParagraph()
  return html.join('\n')
}

export function estimateReadingTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min`
}
