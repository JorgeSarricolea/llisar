import { useCallback, useMemo, useState } from 'react'
import DemoVideoDialog from '../DemoVideoDialog.jsx'
import IntegrationsBanner from '../lp/IntegrationsBanner.jsx'
import { LivingChat, OpsFollow } from '../lp/demo.jsx'
import { getLpVariant, nicheWaLinkProps } from '../lp/variants.js'
import { AppLink } from '../routing.jsx'

export default function NicheLanding({ variantId }) {
  const variant = getLpVariant(variantId)
  const [demoOpen, setDemoOpen] = useState(false)
  const closeDemo = useCallback(() => setDemoOpen(false), [])
  const niches = useMemo(
    () => (variant ? [variant.niche] : undefined),
    [variant],
  )

  if (!variant) return null

  const wa = nicheWaLinkProps(variant)
  const { hero, focus, method, contact, flow } = variant

  return (
    <main id="contenido">
      <DemoVideoDialog open={demoOpen} onClose={closeDemo} />
      <section className="hero" id="top">
        <div className="hero__media" data-slot="hero" aria-hidden="true">
          <img
            src={hero.photo}
            alt=""
            width="1920"
            height="1280"
            fetchPriority="high"
            style={{ objectPosition: hero.photoPosition }}
          />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy" data-enter="hero">
            <h1>
              {hero.lines.map((line, i) => (
                <span
                  key={line}
                  className="line"
                  style={{ ['--line']: String(i) }}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="lead" data-enter-item>
              {hero.lead}
            </p>
            <div className="hero-actions" data-enter-item>
              <a className="btn btn--accent" {...wa}>
                {hero.cta}
              </a>
              <button
                type="button"
                className="btn btn--ghost"
                aria-haspopup="dialog"
                aria-expanded={demoOpen}
                onClick={() => setDemoOpen(true)}
              >
                {hero.demoLabel}
              </button>
            </div>
          </div>
          <div className="hero__stage" id="hilo" data-enter="stage">
            <LivingChat niches={niches} />
          </div>
        </div>
      </section>

      <OpsFollow niches={niches} copy={flow} waLinkProps={wa} />
      <IntegrationsBanner niche={variant.niche} />

      <section className="chapter" id="enfoque" aria-labelledby="enfoque-title">
        <div className="container">
          <header className="chapter__intro">
            <h2 id="enfoque-title">{focus.title}</h2>
            <p className="section-lead">{focus.lead}</p>
          </header>
        </div>
        <article className="chapter__panel">
          <figure className="chapter__photo" data-slot={variant.niche}>
            <img
              src={focus.photo}
              alt={focus.photoAlt}
              width="1600"
              height="1200"
              loading="lazy"
              decoding="async"
              style={{ objectPosition: focus.photoPosition }}
            />
          </figure>
          <div className="chapter__copy chapter__copy--stack">
            {focus.points.map((point) => (
              <div key={point.index} className="chapter__point">
                <p className="fig chapter__index">{point.index}</p>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="section method" id="metodo">
        <div className="container">
          <div className="method-head">
            <h2>{method.title}</h2>
            <p className="section-lead">{method.lead}</p>
          </div>
          <ol className="steps">
            {method.steps.map((step, i) => (
              <li key={step}>
                <span className="fig">{String(i + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section contact" id="contacto">
        <div className="container">
          <div className="contact-panel">
            <h2>{contact.title}</h2>
            <p className="section-lead contact-lead">{contact.lead}</p>
            <div className="contact-actions">
              <a className="btn btn--accent" {...wa}>
                {hero.cta}
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
