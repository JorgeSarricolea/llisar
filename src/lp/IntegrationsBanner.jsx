import { integrationsFor } from './integrations.js'

export default function IntegrationsBanner({ niche }) {
  const { title, lead, items } = integrationsFor(niche)

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
        <ul className="integrations__logos">
          {items.map((item) => (
            <li key={item.id} className="integrations__item">
              <img
                className="integrations__mark"
                src={item.src}
                alt={item.name}
                width="120"
                height="24"
                loading="lazy"
                decoding="async"
              />
              <span className="integrations__name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
