import { useEffect } from 'react'
import { applyPageSeo } from './seo.js'
import { useRoute } from './routing.jsx'

export function Seo() {
  const { path } = useRoute()

  useEffect(() => {
    applyPageSeo(path)
  }, [path])

  return null
}
