import { useCallback, useState } from 'react'
import { CONTACT_WA_LINK_PROPS } from '../contact.js'
import DemoVideoDialog from '../DemoVideoDialog.jsx'
import IntegrationsBanner from '../lp/IntegrationsBanner.jsx'
import { LivingChat, OpsFollow } from '../lp/demo.jsx'
import { AppLink } from '../routing.jsx'

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false)
  const closeDemo = useCallback(() => setDemoOpen(false), [])

  return (
    <main id="contenido">
      <DemoVideoDialog open={demoOpen} onClose={closeDemo} />
      <section className="hero" id="top">
        <div className="hero__media" data-slot="hero" aria-hidden="true">
          <img
            src="/photos/dusk.jpg"
            alt=""
            width="1920"
            height="1280"
            fetchPriority="high"
            style={{ objectPosition: '50% 40%' }}
          />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy" data-enter="hero">
            <h1>
              <span className="line" style={{ ['--line']: '0' }}>
                De mensaje a visita.
              </span>
              <span className="line" style={{ ['--line']: '1' }}>
                De chat a reserva.
              </span>
            </h1>
            <p className="lead" data-enter-item>
              Agentes de IA en WhatsApp para inmobiliarias y turismo. Contestan,
              califican y dejan la visita o la reserva lista.
            </p>
            <div className="hero-actions" data-enter-item>
              <a className="btn btn--accent" {...CONTACT_WA_LINK_PROPS}>
                Hablar con Llisar
              </a>
              <button
                type="button"
                className="btn btn--ghost"
                aria-haspopup="dialog"
                aria-expanded={demoOpen}
                onClick={() => setDemoOpen(true)}
              >
                Ver el ejemplo
              </button>
            </div>
          </div>
          <div className="hero__stage" id="hilo" data-enter="stage">
            <LivingChat />
          </div>
        </div>
      </section>

      <OpsFollow />
      <IntegrationsBanner />

      <section className="chapter" id="sectores" aria-labelledby="sectores-title">
        <div className="container">
          <header className="chapter__intro">
            <h2 id="sectores-title">Sectores</h2>
            <p className="section-lead">
              Inmobiliaria o turismo — mismo WhatsApp. Elige tu página.
            </p>
          </header>
        </div>
        <article className="chapter__panel">
          <figure className="chapter__photo" data-slot="realty">
            <img
              src="/photos/apartment.jpg"
              alt="Casa amarilla con plantas en la fachada"
              width="1600"
              height="2133"
              loading="lazy"
              decoding="async"
              style={{ objectPosition: '50% 40%' }}
            />
          </figure>
          <div className="chapter__copy">
            <p className="fig chapter__index">01</p>
            <h3>
              <AppLink to="/inmobiliarias">Inmobiliarias</AppLink>
            </h3>
            <p>
              Portales y ads mandan más mensajes de los que el equipo puede
              contestar bien. El agente responde, filtra presupuesto y zona, y
              deja la visita en el calendario con el contexto listo para tu
              asesor.
            </p>
            <p className="chapter__more">
              <AppLink to="/inmobiliarias">Ver página para inmobiliarias</AppLink>
            </p>
          </div>
        </article>
        <article className="chapter__panel chapter__panel--flip">
          <figure className="chapter__photo" data-slot="tourism">
            <img
              src="/photos/hotel.jpg"
              alt="Lobby de hotel con luz natural"
              width="1600"
              height="1016"
              loading="lazy"
              decoding="async"
              style={{ objectPosition: '50% 45%' }}
            />
          </figure>
          <div className="chapter__copy">
            <p className="fig chapter__index">02</p>
            <h3>
              <AppLink to="/turismo">Turismo</AppLink>
            </h3>
            <p>
              Reservas, cambios de fecha y tours llegan a todas horas. Si el
              equipo no da abasto, el huésped se va a Booking. El agente
              confirma, manda el pago y anota la reserva antes de que busquen
              otro.
            </p>
            <p className="chapter__more">
              <AppLink to="/turismo">Ver página para turismo</AppLink>
            </p>
          </div>
        </article>
      </section>

      <section className="section method" id="metodo">
        <div className="container">
          <div className="method-head">
            <h2>De tu WhatsApp actual a un agente en marcha.</h2>
            <p className="section-lead">
              Empezamos por cómo atiendes hoy. Luego el guion, la conexión y
              las pruebas con mensajes reales.
            </p>
          </div>
          <ol className="steps">
            <li>
              <span className="fig">01</span>
              <p>Mapa del proceso: qué preguntas, qué cierras, cuándo pasas a humano.</p>
            </li>
            <li>
              <span className="fig">02</span>
              <p>Guion y tono con la voz de tu marca, no de un bot genérico.</p>
            </li>
            <li>
              <span className="fig">03</span>
              <p>Conexión a calendario, Excel o CRM que ya usas.</p>
            </li>
            <li>
              <span className="fig">04</span>
              <p>Pruebas con consultas reales y entrega con tu equipo.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section contact" id="contacto">
        <div className="container">
          <div className="contact-panel">
            <h2>¿Qué se te escapa hoy en WhatsApp?</h2>
            <p className="section-lead contact-lead">
              Inmobiliaria o turismo. Una llamada corta para ver si encaja.
            </p>
            <div className="contact-actions">
              <a className="btn btn--accent" {...CONTACT_WA_LINK_PROPS}>
                Hablar con Llisar
              </a>
              <AppLink className="btn btn--ghost" to="/nosotros">
                Cómo trabajamos
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
