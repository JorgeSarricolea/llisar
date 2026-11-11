import { useEffect } from 'react'
import { AppLink } from '../routing.jsx'

export default function NotFound() {
  useEffect(() => {
    // Prefer a real HTTP 404 for crawlers (Google soft-404 guidance).
    if (typeof window !== 'undefined' && window.location.pathname !== '/404.html') {
      window.location.replace('/404.html')
    }
  }, [])

  return (
    <main id="contenido" className="page">
      <section className="page-hero">
        <div className="container page-hero__copy">
          <p className="fig">404</p>
          <h1>No encontramos esa página.</h1>
          <p className="lead">
            El enlace puede estar mal escrito o la página ya no existe.
          </p>
          <div className="contact-actions">
            <AppLink className="btn btn--accent" to="/">
              Volver al inicio
            </AppLink>
            <AppLink className="btn btn--ghost" to="/contacto">
              Contacto
            </AppLink>
          </div>
        </div>
      </section>
    </main>
  )
}
