import { CONTACT_WA_LINK_PROPS } from '../contact.js'
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

/** Lives inside the ops flow section — same block, not a separate chapter. */
export default function IntegrationsBanner({ niche, waLinkProps }) {
  const { title, lead, items } = integrationsFor(niche)
  const wa = waLinkProps || CONTACT_WA_LINK_PROPS
  const mid = Math.ceil(items.length / 2)
  const rowA = items.slice(0, mid)
  const rowB = items.slice(mid)
  const second = rowB.length >= 3 ? rowB : items

  return (
    <div className="integrations" id="integraciones">
      <div className="container">
        <header className="integrations__intro">
          <p className="fig integrations__eyebrow">{title}</p>
          <p className="integrations__title">{lead}</p>
        </header>
      </div>

      <div className="integrations__rail">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={second} reverse />
      </div>

      <div className="container">
        <p className="integrations__cta">
          ¿Otro paso o un proceso distinto?{' '}
          <a {...wa}>Escríbenos</a> y lo armamos a tu medida.
        </p>
      </div>

      <ul className="integrations__sr">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
