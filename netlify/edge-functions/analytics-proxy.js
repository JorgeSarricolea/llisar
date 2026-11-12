const UPSTREAM = 'https://llisar.tail475443.ts.net'

export default async (request, context) => {
  const url = new URL(request.url)
  if (url.hostname !== 'analytics.llisar.com') {
    return context.next()
  }

  const target = new URL(url.pathname + url.search, UPSTREAM)
  const headers = new Headers(request.headers)
  headers.delete('host')

  return fetch(target, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'manual',
  })
}

export const config = { path: '/*' }
