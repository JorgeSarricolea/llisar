import { useEffect, useState } from 'react'
import {
  CONTACT_EMAIL,
  CONTACT_FORM_NAME,
  CONTACT_MAIL_LINK_PROPS,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WA_LINK_PROPS,
} from '../contact.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('enviado') === '1') setSent(true)
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError(false)
    const form = event.currentTarget
    const data = new FormData(form)
    data.set('form-name', CONTACT_FORM_NAME)
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      })
      if (!res.ok) throw new Error('submit_failed')
      setSent(true)
      window.history.replaceState({}, '', '/contacto?enviado=1')
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <main id="contenido" className="page">
      <section className="page-hero page-hero--contact">
        <div className="container page-hero__copy page-hero__copy--start">
          <p className="fig">Contacto</p>
          <h1>¿Qué se te escapa hoy en WhatsApp?</h1>
          <p className="lead">
            Inmobiliaria o turismo. Cuéntanos cómo atiendes hoy.
          </p>
          <ul className="contact-channels">
            <li>
              <span className="contact-channels__label">Correo</span>
              <a {...CONTACT_MAIL_LINK_PROPS}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <span className="contact-channels__label">WhatsApp</span>
              <a {...CONTACT_WA_LINK_PROPS}>{CONTACT_PHONE_DISPLAY}</a>
            </li>
            <li>
              <span className="contact-channels__label">Base</span>
              <span>Mérida · remoto</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section contact contact--compose">
        <div className="container">
          {sent ? (
            <div className="contact-compose contact-form-done" role="status">
              <h2>Mensaje enviado</h2>
              <p className="section-lead contact-lead">
                Gracias. Te respondemos pronto.
              </p>
              <p className="contact-actions">
                <a className="btn btn--accent" {...CONTACT_WA_LINK_PROPS}>
                  Seguir por WhatsApp
                </a>
              </p>
            </div>
          ) : (
            <form
              className="contact-compose contact-form"
              name={CONTACT_FORM_NAME}
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
              <input
                type="text"
                name="bot-field"
                className="contact-form__honey"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="contact-form__row">
                <label className="contact-form__field">
                  <span>Nombre</span>
                  <input
                    type="text"
                    name="nombre"
                    required
                    autoComplete="name"
                  />
                </label>
                <label className="contact-form__field">
                  <span>Correo</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="contact-form__row">
                <label className="contact-form__field">
                  <span>WhatsApp</span>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+52…"
                  />
                </label>
                <label className="contact-form__field">
                  <span>Negocio / agencia</span>
                  <input
                    type="text"
                    name="negocio"
                    required
                    autoComplete="organization"
                  />
                </label>
              </div>

              <fieldset className="contact-form__sector">
                <legend>Sector</legend>
                <div className="contact-form__chips">
                  <label className="contact-chip">
                    <input
                      type="radio"
                      name="sector"
                      value="inmobiliaria"
                      required
                    />
                    <span>Inmobiliaria</span>
                  </label>
                  <label className="contact-chip">
                    <input type="radio" name="sector" value="turismo" />
                    <span>Turismo</span>
                  </label>
                  <label className="contact-chip">
                    <input type="radio" name="sector" value="ambos" />
                    <span>Ambos</span>
                  </label>
                </div>
              </fieldset>

              <label className="contact-form__field">
                <span>¿Dónde se te acumulan o enfrían los leads?</span>
                <textarea
                  name="problema"
                  rows={5}
                  required
                  placeholder="Portales de noche, cambios de reserva, visitas sin agendar…"
                />
              </label>

              <label className="contact-form__field">
                <span>Herramientas actuales (opcional)</span>
                <input
                  type="text"
                  name="herramientas"
                  placeholder="Excel, CRM, calendario…"
                />
              </label>

              {error ? (
                <p className="contact-form__error" role="alert">
                  No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.
                </p>
              ) : null}

              <div className="contact-form__footer">
                <button
                  className="btn btn--accent"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? 'Enviando…' : 'Enviar'}
                </button>
                <a className="contact-form__wa" {...CONTACT_WA_LINK_PROPS}>
                  O escribir por WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
