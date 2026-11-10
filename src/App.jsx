import { useEffect, useState } from 'react'
import './App.css'

const THREADS = {
  tourism: {
    label: 'Turismo',
    settled: 'Reservado',
    lines: [
      { from: 'guest', text: 'Hola, ¿tienen disponible del 12 al 15?' },
      {
        from: 'agent',
        text: 'Sí. Suite con vista, desayuno incluido. ¿Cuántas personas?',
      },
      { from: 'guest', text: 'Dos adultos.' },
      {
        from: 'agent',
        text: 'Perfecto. Te dejo el enlace de pago y confirmo la habitación.',
      },
    ],
  },
  realty: {
    label: 'Inmobiliaria',
    settled: 'Visita agendada',
    lines: [
      { from: 'guest', text: 'Vi el depto en Polanco. ¿Sigue libre?' },
      {
        from: 'agent',
        text: 'Sí. 2 recámaras. ¿Prefieres mañana o el sábado?',
      },
      { from: 'guest', text: 'Sábado a las 11.' },
      {
        from: 'agent',
        text: 'Listo. Te mando ubicación y datos del asesor.',
      },
    ],
  },
}

function LivingChat({ niche }) {
  const thread = THREADS[niche]
  const [visible, setVisible] = useState(0)
  const [typingFrom, setTypingFrom] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setVisible(0)
    setTypingFrom(null)
    setDone(false)
    if (reduce) {
      setVisible(thread.lines.length)
      setDone(true)
      return undefined
    }

    let cancelled = false
    let timer
    const wait = (ms) =>
      new Promise((r) => {
        timer = setTimeout(r, ms)
      })

    const run = async () => {
      await wait(480)
      for (let i = 0; i < thread.lines.length; i += 1) {
        if (cancelled) return
        const line = thread.lines[i]
        const think = line.from === 'agent' ? 780 : 420
        const hold = line.from === 'agent' ? 980 : 700
        setTypingFrom(line.from)
        await wait(think)
        if (cancelled) return
        setTypingFrom(null)
        setVisible(i + 1)
        await wait(hold)
      }
      if (!cancelled) {
        await wait(360)
        if (!cancelled) setDone(true)
      }
    }
    run()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [niche, thread.lines])

  return (
    <div className="phone phone--live" aria-live="polite" key={niche}>
      <div className="phone__chrome">
        <span className="phone__dots" aria-hidden="true" />
        <span className="phone__title">WhatsApp / {thread.label}</span>
        <span className="phone__time fig">hoy</span>
      </div>
      <ul className="thread">
        {thread.lines.slice(0, visible).map((line, i) => (
          <li
            key={`${niche}-${i}-${line.text}`}
            className={`bubble bubble--${line.from} is-in`}
            style={{ '--i': i }}
          >
            {line.text}
          </li>
        ))}
        {typingFrom ? (
          <li
            className={`bubble bubble--typing bubble--${typingFrom}`}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </li>
        ) : null}
      </ul>
      <p className={`settled ${done ? 'is-in' : ''}`} aria-hidden={!done}>
        {thread.settled}
      </p>
    </div>
  )
}

function App() {
  const [niche, setNiche] = useState('tourism')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])

  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>

      <header className="site-nav">
        <div className="container nav-row">
          <a className="wordmark" href="#top">
            Llisar
          </a>
          <nav className="nav-links" aria-label="Principal">
            <a href="#sectores" onClick={() => setMenuOpen(false)}>
              Sectores
            </a>
            <a href="#trabajo" onClick={() => setMenuOpen(false)}>
              Trabajo
            </a>
            <a href="#metodo" onClick={() => setMenuOpen(false)}>
              Cómo trabajamos
            </a>
            <a
              className="btn btn--accent"
              href="#contacto"
              onClick={() => setMenuOpen(false)}
            >
              Hablar con Llisar
            </a>
          </nav>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>
        </div>
        <div id="mobile-nav" className="mobile-nav" hidden={!menuOpen}>
          <a href="#sectores" onClick={() => setMenuOpen(false)}>
            Sectores
          </a>
          <a href="#trabajo" onClick={() => setMenuOpen(false)}>
            Trabajo
          </a>
          <a href="#metodo" onClick={() => setMenuOpen(false)}>
            Cómo trabajamos
          </a>
          <a
            className="btn btn--accent"
            href="#contacto"
            onClick={() => setMenuOpen(false)}
          >
            Hablar con Llisar
          </a>
        </div>
      </header>

      <main id="contenido">
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
                  Atiende de noche.
                </span>
                <span className="line" style={{ ['--line']: '1' }}>
                  Responde con calma.
                </span>
              </h1>
              <p className="lead" data-enter-item>
                Agentes de IA en WhatsApp para empresas de turismo e
                inmobiliarias.
              </p>
              <div className="hero-actions" data-enter-item>
                <a className="btn btn--accent" href="#contacto">
                  Hablar con Llisar
                </a>
                <a className="btn btn--ghost" href="#hilo">
                  Ver un ejemplo
                </a>
              </div>
            </div>
            <div className="hero__stage" id="hilo" data-enter="stage">
              <fieldset className="seg">
                <legend className="visually-hidden">Sector del ejemplo</legend>
                <input
                  type="radio"
                  name="niche"
                  id="n-tourism"
                  checked={niche === 'tourism'}
                  onChange={() => setNiche('tourism')}
                />
                <label htmlFor="n-tourism">Turismo</label>
                <input
                  type="radio"
                  name="niche"
                  id="n-realty"
                  checked={niche === 'realty'}
                  onChange={() => setNiche('realty')}
                />
                <label htmlFor="n-realty">Inmobiliaria</label>
              </fieldset>
              <LivingChat niche={niche} />
            </div>
          </div>
        </section>

        <section className="chapter" id="sectores">
          <article className="chapter__panel">
            <figure className="chapter__photo" data-slot="tourism">
              <img
                src="/photos/hotel.jpg"
                alt="Entrada de hotel iluminada a la hora azul"
                width="1920"
                height="1213"
                style={{ objectPosition: '45% 55%' }}
              />
            </figure>
            <div className="chapter__copy">
              <p className="fig chapter__index">01</p>
              <h2>Turismo</h2>
              <p>
                Hoteles boutique y tours: disponibilidad, paquetes y
                confirmación sin dejar al huésped esperando.
              </p>
            </div>
          </article>
          <article className="chapter__panel chapter__panel--flip">
            <figure className="chapter__photo" data-slot="realty">
              <img
                src="/photos/apartment.jpg"
                alt="Edificio de departamentos con reflejo en un charco"
                width="1280"
                height="853"
                style={{ objectPosition: '50% 45%' }}
              />
            </figure>
            <div className="chapter__copy">
              <p className="fig chapter__index">02</p>
              <h2>Inmobiliarias</h2>
              <p>
                Precio, zona y visita a cualquier hora. El agente ordena la
                consulta y la pasa a tu asesor con el contexto listo.
              </p>
            </div>
          </article>
        </section>

        <section className="section work" id="trabajo">
          <div className="container">
            <div className="section__intro">
              <h2>Qué puede hacer el agente por ti.</h2>
              <p className="section-lead">
                Lo diseñamos alrededor del proceso que ya usas en WhatsApp.
              </p>
            </div>
            <ol className="rail">
              <li className="rail__card">
                <span className="fig">01</span>
                <h3>Ordenar consultas</h3>
                <p>Presupuesto, fechas o zona antes de ocupar a alguien.</p>
              </li>
              <li className="rail__card">
                <span className="fig">02</span>
                <h3>Fuera de horario</h3>
                <p>Responde de noche con tu tono y deja el siguiente paso.</p>
              </li>
              <li className="rail__card">
                <span className="fig">03</span>
                <h3>Agendar visitas</h3>
                <p>Confirma horarios y avisa a tu equipo con el contexto.</p>
              </li>
              <li className="rail__card">
                <span className="fig">04</span>
                <h3>Dar seguimiento</h3>
                <p>Recordatorios y documentos que hoy se pierden en el chat.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section method" id="metodo">
          <div className="container">
            <div className="method-head">
              <h2>Te acompañamos hasta que quede en marcha.</h2>
              <p className="section-lead">
                Revisamos el proceso, diseñamos la conversación, la conectamos a
                WhatsApp y la afinamos con tu equipo.
              </p>
            </div>
            <ol className="steps">
              <li>
                <span className="fig">01</span>
                <p>Mapa del proceso de ventas o atención.</p>
              </li>
              <li>
                <span className="fig">02</span>
                <p>Guion, tono y cuándo pasar a una persona.</p>
              </li>
              <li>
                <span className="fig">03</span>
                <p>Conexión a calendario, CRM o hojas de cálculo.</p>
              </li>
              <li>
                <span className="fig">04</span>
                <p>Pruebas con consultas reales y entrega clara.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section contact" id="contacto">
          <div className="container">
            <div className="contact-panel">
              <h2>Cuéntanos cómo atiendes hoy por WhatsApp.</h2>
              <p className="section-lead contact-lead">
                Turismo o inmobiliaria. Una conversación breve para ver si
                podemos ayudarte.
              </p>
              <div className="contact-actions">
                <a
                  className="btn btn--accent"
                  href="mailto:hola@llisar.com?subject=Conversacion%20Llisar"
                >
                  Escribir a Llisar
                </a>
                <a className="btn btn--ghost" href="mailto:hola@llisar.com">
                  hola@llisar.com
                </a>
              </div>
              <p className="fill-note">
                WhatsApp:{' '}
                <span className="fill" data-fill="whatsapp">
                  número por confirmar
                </span>
                . Base:{' '}
                <span className="fill" data-fill="city">
                  ciudad por confirmar
                </span>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-row">
          <div>
            <p className="wordmark">Llisar</p>
            <p className="colophon">
              Consultoría para empresas. Agentes de IA en WhatsApp para turismo
              e inmobiliarias.
            </p>
          </div>
          <div className="footer-links">
            <a href="mailto:hola@llisar.com">hola@llisar.com</a>
            <a href="#sectores">Sectores</a>
            <a href="#trabajo">Trabajo</a>
          </div>
        </div>
        <div className="container photo-credits">
          <p>
            Photographs:{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Conwy_Estuary_at_dusk_-_geograph.org.uk_-_4556293.jpg">
              Matt Harrop
            </a>
            ,{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Entrance_lobby_of_Amantaka_luxury_Resort_%26_Hotel_at_blue_hour_in_Luang_Prabang_Laos.jpg">
              Basile Morin
            </a>
            ,{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Appartment_building_from_Banner_Street_2024-01-11.jpg">
              Tom Page
            </a>
            ,{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Young_businesswoman_holding_her_smartphone_in_the_home_office.jpg">
              Shixart1985
            </a>{' '}
            (Wikimedia Commons).
          </p>
          <p className="legal">© Llisar. llisar.com</p>
        </div>
      </footer>
    </>
  )
}

export default App
