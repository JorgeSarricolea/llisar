import { useEffect, useState } from 'react'
import {
  CONTACT_EMAIL,
  CONTACT_FORM_ACTION,
  CONTACT_MAIL_LINK_PROPS,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WA_LINK_PROPS,
} from '../contact.js'

export default function Contact() {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('enviado') === '1') setSent(true)
  }, [])

  return (
    <main id="contenido" className="page">
      <section className="page-hero">
        <div className="container page-hero__copy">
          <p className="fig">Contacto</p>
          <h1>¿Qué se te escapa hoy en WhatsApp?</h1>
          <p className="lead">
            Inmobiliaria o turismo. Cuéntanos cómo atiendes hoy — te
            respondemos por correo o WhatsApp.
          </p>
        </div>
      </section>

      <section className="section contact">
        <div className="container contact-layout">
          <div className="contact-panel">
            <dl className="contact-facts">
              <div>
                <dt>Soporte</dt>
                <dd>
                  <a {...CONTACT_MAIL_LINK_PROPS}>{CONTACT_EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a {...CONTACT_WA_LINK_PROPS}>{CONTACT_PHONE_DISPLAY}</a>
                </dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>Mérida, México · trabajamos en remoto</dd>
              </div>
            </dl>
            <p className="contact-actions">
              <a className="btn btn--accent" {...CONTACT_WA_LINK_PROPS}>
                Escribir por WhatsApp
              </a>
            </p>
          </div>

          <div className="contact-panel contact-panel--form">
            {sent ? (
              <div className="contact-form-done" role="status">
                <h2>Mensaje enviado</h2>
                <p className="section-lead contact-lead">
                  Gracias. Llegó a {CONTACT_EMAIL}. Te respondemos pronto.
                </p>
              </div>
            ) : (
              <>
                <h2 className="contact-form__title">Escríbenos</h2>
                <p className="section-lead contact-lead">
                  El mensaje llega a {CONTACT_EMAIL}.
                </p>
                <form
                  className="contact-form"
                  action={CONTACT_FORM_ACTION}
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="_subject"
                    value="Nuevo mensaje desde llisar.com"
                  />
                  <input type="hidden" name="_template" value="table" />
                  <input
                    type="hidden"
                    name="_next"
                    value="https://llisar.com/contacto?enviado=1"
                  />
                  <input
                    type="text"
                    name="_honey"
                    className="contact-form__honey"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
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
                  <label className="contact-form__field">
                    <span>Mensaje</span>
                    <textarea name="mensaje" rows={5} required />
                  </label>
                  <button className="btn btn--accent" type="submit">
                    Enviar a {CONTACT_EMAIL}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
