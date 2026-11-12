import { integrationsFor } from './integrations.js'

function MarqueeRow({ items, reverse = false }) {
  const loop = [...items, ...items]
  return (
    <div
      className={`integrations__marquee${reverse ? ' integrations__marquee--rev' : ''}`}
      aria-hidden="true"
    >
      <div className="integrations__track">
        {loop.map((item, i) => (
          <span key={`${item.id}-${i}`} className="integrations__cell">
            {item.icon && item.src ? (
              <img
                className="integrations__mark"
                src={item.src}
                alt=""
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <span className="integrations__label">{item.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function IntegrationsBanner({ niche }) {
  const { title, lead, items } = integrationsFor(niche)
  const mid = Math.ceil(items.length / 2)
  const rowA = items.slice(0, mid)
  const rowB = items.slice(mid)
  const second = rowB.length >= 3 ? rowB : items

  return (
    <section
      className="integrations"
      id="integraciones"
      aria-labelledby="integraciones-title"
    >
      <div className="container">
        <header className="integrations__intro">
          <p className="fig integrations__eyebrow">{title}</p>
          <h2 id="integraciones-title" className="integrations__title">
            {lead}
          </h2>
        </header>
      </div>

      <div className="integrations__rail">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={second} reverse />
      </div>

      <ul className="integrations__sr">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </section>
  )
}
