import { useEffect, useState } from 'react'
import IntegrationsBanner from './IntegrationsBanner.jsx'

const DEMO_CASES = [
  {
    niche: 'realty',
    contact: 'Mariana Vega',
    avatar: 'MV',
    status: 'en línea',
    lines: [
      {
        from: 'guest',
        text: 'Hola, ¿sigue disponible el depa de Córdoba 45?',
        time: '11:07',
      },
      {
        from: 'agent',
        text: 'Hola Mariana, soy Sofía de Ruiz. Sí, sigue libre. ¿Lo buscas para rentar?',
        time: '11:07',
      },
      {
        from: 'guest',
        text: 'Sí. ¿Cuánto piden y aceptan perro chico?',
        time: '11:08',
      },
      {
        from: 'agent',
        text: '26 mil + mtto. Sí a mascotas chicas. 2 rec, 1 baño, 1 cajón. Te mando la ficha.',
        time: '11:08',
      },
      {
        from: 'guest',
        text: 'Ok. ¿Puedo verlo este sábado?',
        time: '11:10',
      },
      {
        from: 'agent',
        text: 'Claro. ¿Te queda el sábado 11:00 o el domingo 12:30?',
        time: '11:11',
      },
      {
        from: 'guest',
        text: 'Sábado 11.',
        time: '11:12',
      },
      {
        from: 'agent',
        text: 'Agendado. Te mando pin y te recuerdo un día antes.',
        time: '11:13',
      },
    ],
  },
  {
    niche: 'tourism',
    contact: 'Carla · Casa Azul',
    avatar: 'CM',
    status: 'en línea',
    lines: [
      {
        from: 'guest',
        text: 'Hola, ¿tienen del 12 al 15 de abril? Estoy en Booking casi listo.',
        time: '21:14',
      },
      {
        from: 'agent',
        text: 'Hola Carla. Sí hay suite con vista. Directo te dejamos el mismo tipo de habitación con desayuno. ¿2 adultos?',
        time: '21:14',
      },
      {
        from: 'guest',
        text: 'Sí. ¿Cuánto sale y qué incluye?',
        time: '21:15',
      },
      {
        from: 'agent',
        text: '4,890 MXN la estancia. Desayuno, WiFi y late check-out 13:00. ¿Te mando el link de pago?',
        time: '21:16',
      },
      {
        from: 'guest',
        text: 'Ok, pago directo ahora.',
        time: '21:17',
      },
      {
        from: 'agent',
        text: 'Listo. Link aquí. Al pagar te confirmo la habitación en este chat.',
        time: '21:17',
      },
    ],
  },
  {
    niche: 'realty',
    contact: 'Luis · Inmuebles24',
    avatar: 'LR',
    status: 'en línea',
    lines: [
      {
        from: 'guest',
        text: 'Vi el depto en Polanco por Inmuebles24. ¿Sigue?',
        time: '00:14',
      },
      {
        from: 'agent',
        text: 'Sí, Luis. 2 recámaras en Homero. ¿Presupuesto tope y para cuándo lo necesitas?',
        time: '00:14',
      },
      {
        from: 'guest',
        text: 'Hasta 45 mil. Mudanza en marzo. Si no contestan hoy, escribo a otros.',
        time: '00:15',
      },
      {
        from: 'agent',
        text: 'Te lo aparto en agenda. ¿Lunes 10:00 o martes 18:00 te funciona?',
        time: '00:16',
      },
      {
        from: 'guest',
        text: 'Martes 18.',
        time: '00:17',
      },
      {
        from: 'agent',
        text: 'Listo. Te dejo ubicación y el nombre del asesor. Mañana te confirmo.',
        time: '00:18',
      },
    ],
  },
  {
    niche: 'tourism',
    contact: 'Diego · MB-441',
    avatar: 'DR',
    status: 'en línea',
    lines: [
      {
        from: 'guest',
        text: 'Hola, soy Diego, reserva MB-441. El vuelo se movió: necesito 18–21 en vez de 17–20.',
        time: '00:27',
      },
      {
        from: 'agent',
        text: 'Hola Diego. Reviso disponibilidad para el 18–21… junior suite libre. ¿Mantienes 2 adultos?',
        time: '00:28',
      },
      {
        from: 'guest',
        text: 'Sí. ¿Me cobran diferencia?',
        time: '00:29',
      },
      {
        from: 'agent',
        text: 'Misma tarifa. Actualizo en sistema y te mando la nueva confirmación.',
        time: '00:29',
      },
      {
        from: 'guest',
        text: 'Perfecto, gracias.',
        time: '00:30',
      },
      {
        from: 'agent',
        text: 'Cambio hecho. Confirmación MB-441 · 18–21 en tu correo y aquí.',
        time: '00:30',
      },
    ],
  },
]

function Icon({ children, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

function WaChecks() {
  return (
    <svg className="wa-checks" viewBox="0 0 16 11" aria-hidden="true">
      <path d="M11.07.35 5.7 6.42 3.93 4.55 2.7 5.82l3 3.18 6.6-7.4z" />
      <path d="M14.07.35 8.7 6.42 7.78 5.45 6.55 6.72l2.15 2.28 6.6-7.4z" />
    </svg>
  )
}

export function LivingChat({ niches } = {}) {
  const nicheKey = niches?.length ? niches.join(',') : 'all'
  const cases = niches?.length
    ? DEMO_CASES.filter((c) => niches.includes(c.niche))
    : DEMO_CASES
  const [caseIndex, setCaseIndex] = useState(0)
  const thread = cases[caseIndex % Math.max(cases.length, 1)]
  const [visible, setVisible] = useState(0)
  const [typingFrom, setTypingFrom] = useState(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    setCaseIndex(0)
  }, [nicheKey])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setVisible(0)
    setTypingFrom(null)
    setFading(false)
    if (reduce) {
      setVisible(thread.lines.length)
      return undefined
    }

    let cancelled = false
    let timer
    const wait = (ms) =>
      new Promise((r) => {
        timer = setTimeout(r, ms)
      })

    const run = async () => {
      await wait(900)
      for (let i = 0; i < thread.lines.length; i += 1) {
        if (cancelled) return
        const line = thread.lines[i]
        const chars = line.text.length
        const think =
          line.from === 'agent'
            ? Math.min(2400, 1100 + chars * 18)
            : Math.min(1600, 700 + chars * 10)
        const hold =
          line.from === 'agent'
            ? Math.min(3200, 1600 + chars * 22)
            : Math.min(2400, 1200 + chars * 14)
        setTypingFrom(line.from)
        await wait(think)
        if (cancelled) return
        setTypingFrom(null)
        setVisible(i + 1)
        await wait(hold)
      }
      if (cancelled) return
      await wait(7500)
      if (cancelled) return
      setFading(true)
      await wait(700)
      if (cancelled) return
      setVisible(0)
      setFading(false)
      setCaseIndex((i) => i + 1)
    }
    run()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [caseIndex, thread])

  useEffect(() => {
    const el = document.querySelector('.phone--wa .thread')
    if (el) el.scrollTop = el.scrollHeight
  }, [visible, typingFrom])

  // Contact is on the left (guest). Header "escribiendo…" only when they type.
  const headerStatus =
    typingFrom === 'guest' ? 'escribiendo…' : thread.status
  const clock = thread.lines[Math.max(0, visible - 1)]?.time
    ?? thread.lines[0]?.time
    ?? '11:07'

  return (
    <div
      className="device device--iphone device--live"
      aria-live="polite"
    >
      <span className="device__btn device__btn--silent" aria-hidden="true" />
      <span className="device__btn device__btn--vol-up" aria-hidden="true" />
      <span className="device__btn device__btn--vol-down" aria-hidden="true" />
      <span className="device__btn device__btn--power" aria-hidden="true" />
      <div className="device__shell">
        <div className="device__screen">
          <span className="device__island" aria-hidden="true" />
          <div
            className={`phone phone--wa${fading ? ' phone--fade' : ''}`}
            key={`demo-${caseIndex}`}
          >
            <div className="wa-status" aria-hidden="true">
              <span className="wa-status__time">{clock}</span>
              <span className="wa-status__icons">
                <span className="wa-status__signal">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <svg
                  className="wa-status__wifi"
                  viewBox="0 0 16 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 9.75a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.55 7.7a4.9 4.9 0 0 1 6.9 0"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2.35 5.35a8 8 0 0 1 11.3 0"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                  />
                  <path
                    d="M.7 3a10.8 10.8 0 0 1 14.6 0"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="wa-status__battery">
                  <span className="wa-status__battery-body">
                    <span className="wa-status__battery-level" />
                  </span>
                  <span className="wa-status__battery-cap" />
                </span>
              </span>
            </div>

            <header className="wa-header" aria-hidden="true">
              <div className="wa-header__left">
                <Icon className="wa-ico">
                  <path
                    fill="currentColor"
                    d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                  />
                </Icon>
                <span className="wa-header__avatar">{thread.avatar}</span>
                <div className="wa-header__meta">
                  <p className="wa-header__name">{thread.contact}</p>
                  <p className="wa-header__status">{headerStatus}</p>
                </div>
              </div>
              <div className="wa-header__actions">
                <Icon className="wa-ico">
                  <path
                    fill="currentColor"
                    d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.4 21 3 13.6 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  />
                </Icon>
                <Icon className="wa-ico">
                  <path
                    fill="currentColor"
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </Icon>
              </div>
            </header>

            <div className="wa-body">
              <ul className="thread">
                {thread.lines.slice(0, visible).map((line, i) => (
                  <li
                    key={`${caseIndex}-${i}-${line.text}`}
                    className={`bubble bubble--${line.from} is-in`}
                    style={{ '--i': i }}
                  >
                    <span className="bubble__text">{line.text}</span>
                    <span className="wa-meta">
                      <time dateTime={`T${line.time}`}>{line.time}</time>
                      {line.from === 'agent' ? <WaChecks /> : null}
                    </span>
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
            </div>

            <div className="wa-compose" aria-hidden="true">
              <div className="wa-compose__input">
                <Icon className="wa-compose__ico">
                  <path
                    fill="currentColor"
                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM8.5 8c.83 0 1.5.67 1.5 1.5S9.33 11 8.5 11 7 10.33 7 9.5 7.67 8 8.5 8zM12 18c-2.28 0-4.22-1.66-5-4h10c-.78 2.34-2.72 4-5 4zm3.5-7c-.83 0-1.5-.67-1.5-1.5S14.67 8 15.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                  />
                </Icon>
                <span className="wa-compose__placeholder">Mensaje</span>
                <Icon className="wa-compose__ico wa-compose__ico--attach">
                  <path
                    fill="currentColor"
                    d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
                  />
                </Icon>
                <Icon className="wa-compose__ico">
                  <path
                    fill="currentColor"
                    d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                  />
                </Icon>
              </div>
              <button type="button" className="wa-compose__mic" tabIndex={-1}>
                <Icon className="wa-compose__mic-ico">
                  <path
                    fill="currentColor"
                    d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
                  />
                </Icon>
              </button>
            </div>
          </div>
          <span className="device__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

const OPS = {
  realty: {
    wa: {
      avatar: 'MV',
      name: 'Mariana Vega',
      bubble: 'Agendado. Te mando pin y te recuerdo un día antes.',
      settled: 'Visita lista · lead calificado',
    },
    cal: {
      month: 'Nov 2026',
      day: 'Sáb',
      date: '15',
      hours: ['10', '11', '12'],
      event: {
        time: '11:00–11:40',
        title: 'Visita · Córdoba 45',
        meta: 'Mariana · Roma Norte',
        slot: 1,
        span: 40 / 60,
      },
    },
    sheet: {
      file: 'Leads_Ruiz.xlsx',
      tab: 'Visitas',
      headers: ['Fecha', 'Nombre', 'Interés', 'Estado'],
      prior: [
        ['14/11', 'Carlos M.', 'Polanco', 'Seguimiento'],
        ['14/11', 'Elena R.', 'Condesa', 'Ficha'],
      ],
      row: ['15/11', 'Mariana V.', 'Córdoba 45', 'Visita'],
    },
  },
  tourism: {
    wa: {
      avatar: 'CM',
      name: 'Carla · Casa Azul',
      bubble: 'Listo. Link aquí. Al pagar te confirmo la habitación.',
      settled: 'Reserva directa · sin comisión',
    },
    cal: {
      month: 'Abr 2026',
      day: 'Dom',
      date: '12',
      hours: ['14', '15', '16'],
      event: {
        time: '15:00–15:30',
        title: 'Check-in · Casa Azul',
        meta: 'Carla · Suite vista',
        slot: 1,
        span: 30 / 60,
      },
    },
    sheet: {
      file: 'Reservas_Azul.xlsx',
      tab: 'Directas',
      headers: ['Fechas', 'Huésped', 'Habitación', 'Estado'],
      prior: [
        ['10–13', 'Tomás L.', 'Junior', 'OK'],
        ['11–14', 'Ana P.', 'Estándar', 'Depósito'],
      ],
      row: ['12–15', 'Carla M.', 'Suite', 'Pagada'],
    },
  },
}

const OPS_ORDER = ['realty', 'tourism']

const DEFAULT_FLOW_COPY = {
  title: 'Del mensaje a la agenda y a Excel.',
  lead:
    'Si el chat confirma, el evento y la fila salen solos. Tu equipo abre el calendario o la hoja que ya usa.',
  capsLabel: 'En el mismo hilo, el agente también',
  caps: [
    {
      strong: 'Califica',
      span: 'presupuesto, zona o fechas antes de ocupar a un asesor.',
    },
    {
      strong: 'Atiende de noche',
      span: 'pico de leads sin dejar el chat a medias.',
    },
    {
      strong: 'Agenda',
      span: 'visita o check-in con nombre y detalle.',
    },
    {
      strong: 'Registra',
      span: 'la fila en Excel o CRM, sin copiar a mano.',
    },
  ],
}

export function OpsFollow({ niches = OPS_ORDER, copy, waLinkProps } = {}) {
  const order = niches?.length ? niches : OPS_ORDER
  const orderKey = order.join(',')
  const rotateNiches = order.length > 1
  const [nicheIndex, setNicheIndex] = useState(0)
  const niche = order[nicheIndex % order.length]
  const data = OPS[niche]
  const [step, setStep] = useState(0)
  const flow = { ...DEFAULT_FLOW_COPY, ...copy }
  const integrationsNiche = order.length === 1 ? order[0] : undefined

  useEffect(() => {
    setNicheIndex(0)
  }, [orderKey])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setStep(2)
      return undefined
    }

    let cancelled = false
    let timer
    const wait = (ms) =>
      new Promise((r) => {
        timer = setTimeout(r, ms)
      })

    const run = async () => {
      while (!cancelled) {
        setStep(0)
        await wait(900)
        if (cancelled) return
        setStep(1)
        await wait(2800)
        if (cancelled) return
        setStep(2)
        await wait(3600)
        if (cancelled) return
        await wait(1200)
        if (cancelled) return
        if (rotateNiches) setNicheIndex((i) => i + 1)
      }
    }
    run()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [orderKey, rotateNiches])

  return (
    <section className="flow" id="que-hace" aria-labelledby="que-hace-title">
      <div className="container">
        <header className="flow__intro">
          <h2 id="que-hace-title">{flow.title}</h2>
          <p className="section-lead">{flow.lead}</p>
        </header>

        <ol className="flow__track" data-step={step}>
          <li className={`flow__beat${step >= 0 ? ' is-on' : ''}`}>
            <div className="flow__node">
              <span>01</span>
              <p>WhatsApp</p>
            </div>
            <div className="flow-card flow-card--wa" aria-hidden="true">
              <div className="flow-wa__chrome">
                <span className="flow-wa__avatar">{data.wa.avatar}</span>
                <div className="flow-wa__meta">
                  <p className="flow-wa__name">{data.wa.name}</p>
                  <p className="flow-wa__status">en línea</p>
                </div>
              </div>
              <div className="flow-wa__thread">
                <div className="flow-wa__bubble">
                  <span>{data.wa.bubble}</span>
                  <time>11:13</time>
                </div>
                <p className={`flow-wa__settled${step >= 0 ? ' is-in' : ''}`}>
                  {data.wa.settled}
                </p>
              </div>
            </div>
          </li>

          <li
            className={`flow__link${step >= 1 ? ' is-lit' : ''}`}
            aria-hidden="true"
          />

          <li className={`flow__beat${step >= 1 ? ' is-on' : ''}`}>
            <div className="flow__node">
              <span>02</span>
              <p>Calendario</p>
            </div>
            <div className="flow-card flow-card--cal" aria-hidden="true">
              <div className="flow-cal__top">
                <p className="flow-cal__title">Agenda</p>
                <p className="flow-cal__month">{data.cal.month}</p>
              </div>
              <div className="flow-cal__body">
                <div className="flow-cal__corner" aria-hidden="true" />
                <div className="flow-cal__day-head">
                  <span>{data.cal.day}</span>
                  <strong>{data.cal.date}</strong>
                </div>
                <div className="flow-cal__gutter">
                  {data.cal.hours.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
                <div className="flow-cal__lanes">
                  {data.cal.hours.map((h) => (
                    <div key={h} className="flow-cal__hour" />
                  ))}
                  <article
                    className={`flow-cal__event${step >= 1 ? ' is-in' : ''}`}
                    style={{
                      ['--slot']: data.cal.event.slot,
                      ['--span']: data.cal.event.span,
                    }}
                  >
                    <p>
                      <span className="flow-cal__event-time">
                        {data.cal.event.time}
                      </span>
                      <span className="flow-cal__event-title">
                        {data.cal.event.title}
                      </span>
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </li>

          <li
            className={`flow__link${step >= 2 ? ' is-lit' : ''}`}
            aria-hidden="true"
          />

          <li className={`flow__beat${step >= 2 ? ' is-on' : ''}`}>
            <div className="flow__node">
              <span>03</span>
              <p>Excel</p>
            </div>
            <div className="flow-card flow-card--sheet" aria-hidden="true">
              <div className="flow-sheet__top">
                <p className="flow-sheet__file">{data.sheet.file}</p>
                <p className="flow-sheet__tab">{data.sheet.tab}</p>
              </div>
              <div className="flow-sheet__table">
                <table>
                  <thead>
                    <tr>
                      {data.sheet.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.sheet.prior.map((cells) => (
                      <tr key={cells.join('-')}>
                        {cells.map((c) => (
                          <td key={c}>{c}</td>
                        ))}
                      </tr>
                    ))}
                    <tr className={`flow-sheet__new${step >= 2 ? ' is-in' : ''}`}>
                      {data.sheet.row.map((c, i) => (
                        <td key={`${c}-${i}`}>{step >= 2 ? c : '·'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
        </ol>

        <div className="flow__caps">
          <p className="flow__caps-label">{flow.capsLabel}</p>
          <ul className="flow__caps-list">
            {flow.caps.map((cap) => (
              <li key={cap.strong}>
                <strong>{cap.strong}</strong>
                <span>{cap.span}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <IntegrationsBanner
        niche={integrationsNiche}
        waLinkProps={waLinkProps}
      />
    </section>
  )
}

