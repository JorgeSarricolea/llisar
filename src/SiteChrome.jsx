import { useState } from 'react'
import { CONTACT_EMAIL, CONTACT_MAIL_LINK_PROPS, CONTACT_WA_LINK_PROPS } from './contact.js'
import { AppLink, HomeSectionLink, useRoute } from './routing.jsx'

export function SiteNav() {
  const { path } = useRoute()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  const onHome = path === '/'

  return (
    <header className="site-nav">
      <div className="container nav-row">
        <AppLink className="wordmark" to="/" onClick={close}>
          <img className="wordmark__mark" src="/mark.svg" alt="" width="28" height="28" />
          Llisar
        </AppLink>
        <nav className="nav-links" aria-label="Principal">
          {onHome ? (
            <>
              <HomeSectionLink id="sectores" onClick={close}>
                Sectores
              </HomeSectionLink>
              <HomeSectionLink id="que-hace" onClick={close}>
                Qué hace
              </HomeSectionLink>
              <HomeSectionLink id="metodo" onClick={close}>
                Método
              </HomeSectionLink>
            </>
          ) : (
            <AppLink to="/" onClick={close}>
              Inicio
            </AppLink>
          )}
          <AppLink to="/nosotros" onClick={close}>
            Nosotros
          </AppLink>
          <AppLink to="/blog" onClick={close}>
            Blog
          </AppLink>
          <a
            className="btn btn--accent"
            {...CONTACT_WA_LINK_PROPS}
            onClick={close}
          >
            Hablar con Llisar
          </a>
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="nav-toggle__icon" aria-hidden="true">
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </button>
      </div>
      <div id="mobile-nav" className="mobile-nav" hidden={!menuOpen}>
        {onHome ? (
          <>
            <HomeSectionLink id="sectores" onClick={close}>
              Sectores
            </HomeSectionLink>
            <HomeSectionLink id="que-hace" onClick={close}>
              Qué hace
            </HomeSectionLink>
            <HomeSectionLink id="metodo" onClick={close}>
              Método
            </HomeSectionLink>
          </>
        ) : (
          <AppLink to="/" onClick={close}>
            Inicio
          </AppLink>
        )}
        <AppLink to="/nosotros" onClick={close}>
          Nosotros
        </AppLink>
        <AppLink to="/blog" onClick={close}>
          Blog
        </AppLink>
        <a
          className="btn btn--accent"
          {...CONTACT_WA_LINK_PROPS}
          onClick={close}
        >
          Hablar con Llisar
        </a>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-bottom">
        <AppLink className="wordmark wordmark--footer" to="/">
          <img className="wordmark__mark" src="/mark.svg" alt="" width="24" height="24" />
          Llisar
        </AppLink>
        <nav className="footer-nav" aria-label="Pie de página">
          <AppLink to="/nosotros">Nosotros</AppLink>
          <AppLink to="/blog">Blog</AppLink>
          <AppLink to="/contacto">Contacto</AppLink>
          <AppLink to="/inmobiliarias">Inmobiliarias</AppLink>
          <AppLink to="/turismo">Turismo</AppLink>
          <HomeSectionLink id="sectores">Sectores</HomeSectionLink>
          <HomeSectionLink id="que-hace">Qué hace</HomeSectionLink>
          <a {...CONTACT_MAIL_LINK_PROPS}>Soporte</a>
        </nav>
      </div>
      <div className="container footer-legal">
        <p>
          © Llisar · Mérida · llisar.com ·{' '}
          <a {...CONTACT_MAIL_LINK_PROPS}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </footer>
  )
}
