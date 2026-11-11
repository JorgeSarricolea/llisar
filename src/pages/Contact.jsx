import { CONTACT_PHONE_DISPLAY, CONTACT_WA_LINK_PROPS } from '../contact.js'

export default function Contact() {
  return (
    <main id="contenido" className="page">
      <section className="page-hero">
        <div className="container page-hero__copy">
          <p className="fig">Contacto</p>
          <h1>¿Qué se te escapa hoy en WhatsApp?</h1>
          <p className="lead">
            Inmobiliaria o turismo. Una llamada corta para ver si un agente
            encaja con cómo atiendes ahora.
          </p>
        </div>
      </section>

      <section className="section contact">
        <div className="container">
          <div className="contact-panel">
            <dl className="contact-facts">
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a {...CONTACT_WA_LINK_PROPS}>
                    {CONTACT_PHONE_DISPLAY}
                  </a>
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
        </div>
      </section>
    </main>
  )
}
