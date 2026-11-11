import { CONTACT_WA_LINK_PROPS } from '../contact.js'
import { AppLink } from '../routing.jsx'

export default function About() {
  return (
    <main id="contenido" className="page">
      <section className="page-hero page-hero--about">
        <div className="container">
          <h1>Quiénes somos</h1>
        </div>
      </section>

      <section className="section about-body">
        <div className="container">
          <figure className="about-hero-fig">
            <img
              src="/photos/about.jpg"
              alt="Interior con luz cálida, el tipo de ambiente donde operan equipos de inmobiliaria y turismo"
              width="1920"
              height="1280"
              decoding="async"
              style={{ objectPosition: '50% 35%' }}
            />
          </figure>

          <div className="about-split">
            <h2>Construimos el agente que hacía falta en el chat</h2>
            <div className="about-copy">
              <p>
                Cualquiera que atienda inmobiliaria o turismo por WhatsApp
                conoce la rutina. Abren el celular. Contestan uno. Se saltan
                tres. Vuelven al CRM. Mientras, llegan más mensajes de portales,
                ads y huéspedes. Multiplica eso por cada asesor ocupado en una
                visita o un check-in, y deja de ser un mal día: se vuelve la
                forma de perder leads.
              </p>
              <p>
                Llisar nació en 2025 para cerrar ese hueco. No porque el canal
                falle, sino porque el volumen supera al equipo, y de noche o en
                domingo el pipeline se queda a medias. El agente que diseñamos
                califica, agenda y registra con la voz de tu marca, y le pasa a
                tu gente lo que sí necesita una persona.
              </p>
              <p>
                Sin bot de plantilla. Sin pedirte que copies del chat a Excel a
                mano. Tú defines el proceso; nosotros lo convertimos en
                conversación que trabaja.
              </p>
            </div>
          </div>

          <div className="about-split">
            <h2>
              Para quién lo hacemos
              <br />
              y qué sigue
            </h2>
            <div className="about-copy">
              <p>
                Trabajamos con agencias inmobiliarias y de turismo que ya
                viven en un funnel de venta y un CRM: procesos repetitivos en
                WhatsApp, pico de leads, y ganas de no dejar la conversación a
                medias.
              </p>
              <p>
                Base en Mérida, México. Clientes en todo el mundo. Si necesitas
                algo más a medida, lo conversamos: el alcance lo defines tú.
              </p>
            </div>
          </div>

          <div className="about-values">
            <article className="about-value">
              <h3>Tu tono, no una plantilla</h3>
              <p>
                El agente habla como tu marca. Cuando hace falta una persona,
                el traspaso llega con contexto, no con un chat frío.
              </p>
            </article>
            <article className="about-value">
              <h3>Del chat al siguiente paso</h3>
              <p>
                Visita o reserva en el calendario. Fila en Excel o CRM. Lo que
                confirmaste en WhatsApp no se queda solo en el hilo.
              </p>
            </article>
            <article className="about-value">
              <h3>Proceso real primero</h3>
              <p>
                Empezamos por cómo atiendes hoy. Luego el guion, la conexión y
                las pruebas con mensajes reales.
              </p>
            </article>
          </div>

          <p className="about-meta">
            Mérida, México · Desde 2025 · Inmobiliaria y turismo · Clientes en
            todo el mundo
          </p>
        </div>
      </section>

      <section className="section contact about-cta">
        <div className="container">
          <div className="contact-panel">
            <h2>¿Hablamos de tu WhatsApp?</h2>
            <p className="section-lead contact-lead">
              Cuéntanos qué leads se te acumulan o se te enfrían.
            </p>
            <div className="contact-actions">
              <a className="btn btn--accent" {...CONTACT_WA_LINK_PROPS}>
                Hablar con Llisar
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
