import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const RouteContext = createContext(null)

export function RouteProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname || '/')

  useEffect(() => {
    const sync = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const go = useCallback((to) => {
    const next = to.startsWith('/') ? to : `/${to}`
    if (next === window.location.pathname) return
    window.history.pushState({}, '', next)
    setPath(next)
    window.scrollTo(0, 0)
  }, [])

  const goHomeSection = useCallback(
    (id) => {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/')
        setPath('/')
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        })
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    },
    [],
  )

  return (
    <RouteContext.Provider value={{ path, go, goHomeSection }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('useRoute needs RouteProvider')
  return ctx
}

export function AppLink({ to, children, className, onClick, ...rest }) {
  const { go } = useRoute()
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return
        }
        e.preventDefault()
        onClick?.(e)
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

export function HomeSectionLink({ id, children, className, onClick, ...rest }) {
  const { goHomeSection } = useRoute()
  return (
    <a
      href={`/#${id}`}
      className={className}
      onClick={(e) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return
        }
        e.preventDefault()
        onClick?.(e)
        goHomeSection(id)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
