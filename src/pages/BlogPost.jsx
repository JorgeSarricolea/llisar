import { CONTACT_WA_LINK_PROPS } from '../contact.js'
import {
  formatPostDate,
  getPostBySlug,
  getRelatedPosts,
} from '../blog/posts.js'
import { AppLink, useRoute } from '../routing.jsx'
import NotFound from './NotFound.jsx'

function onProseClick(e, go) {
  const anchor = e.target.closest('a')
  if (!anchor) return
  const href = anchor.getAttribute('href')
  if (!href || !href.startsWith('/') || href.startsWith('//')) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  go(href)
}

export default function BlogPost({ slug }) {
  const { go } = useRoute()
  const post = getPostBySlug(slug)
  if (!post) return <NotFound />

  const related = getRelatedPosts(slug)

  return (
    <main id="contenido" className="page">
      <article className="blog-post">
        <header className="page-hero page-hero--post">
          <div className="container blog-post__hero">
            <div className="blog-post__header">
              <p className="blog-post__crumb">
                <AppLink to="/blog">Blog</AppLink>
                <span aria-hidden="true"> / </span>
                <span>Guía</span>
              </p>
              <div className="blog-card__meta blog-post__meta">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} de lectura</span>
              </div>
              <h1>{post.title}</h1>
              <p className="lead">{post.description}</p>
            </div>

            {post.coverImage ? (
              <figure className="blog-cover">
                <img
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  width="1600"
                  height="900"
                  decoding="async"
                  fetchPriority="high"
                />
              </figure>
            ) : null}
          </div>
        </header>

        <div className="section blog-post__body">
          <div className="container blog-post__layout">
            <div
              className="blog-prose"
              onClick={(e) => onProseClick(e, go)}
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            <aside className="blog-cta" aria-label="Contacto">
              <div className="blog-cta__panel">
                <h2>¿Se te enfrían leads en WhatsApp?</h2>
                <p>
                  Diseñamos agentes con la voz de tu marca: contestan, califican
                  y dejan la visita o la reserva lista.
                </p>
                <a className="btn btn--accent" {...CONTACT_WA_LINK_PROPS}>
                  Hablar con Llisar
                </a>
              </div>
            </aside>
          </div>
        </div>

        {related.length > 0 && (
          <section className="section blog-related">
            <div className="container">
              <h2 className="blog-related__title">Sigue leyendo</h2>
              <ul className="blog-cards blog-cards--related">
                {related.map((item) => (
                  <li key={item.slug}>
                    <AppLink className="blog-card" to={item.path}>
                      {item.coverImage ? (
                        <span className="blog-card__media">
                          <img
                            src={item.coverImage}
                            alt=""
                            width="800"
                            height="450"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      ) : null}
                      <span className="blog-card__body">
                        <span className="blog-card__meta">
                          <time dateTime={item.date}>
                            {formatPostDate(item.date)}
                          </time>
                          <span aria-hidden="true">·</span>
                          <span>{item.readingTime}</span>
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
    </main>
  )
}
