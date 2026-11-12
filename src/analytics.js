export const UMAMI_SRC = 'https://analytics.llisar.com/script.js'
export const UMAMI_WEBSITE_ID = 'ed580ee5-c8b3-440b-8f64-0ff4f6d160de'

export function trackPageview(url) {
  if (!window.umami?.track) return
  if (typeof url === 'string') {
    window.umami.track((props) => ({ ...props, url }))
    return
  }
  window.umami.track()
}

export function trackEvent(name, data) {
  if (!name || !window.umami?.track) return
  window.umami.track(name, data)
}

export function initAnalytics() {
  if (typeof document === 'undefined') return
  if (document.querySelector('script[data-llisar-umami]')) return

  const el = document.createElement('script')
  el.defer = true
  el.src = UMAMI_SRC
  el.dataset.websiteId = UMAMI_WEBSITE_ID
  el.dataset.llisarUmami = '1'
  document.head.appendChild(el)
}
