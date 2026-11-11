import { getAllPosts, formatPostDate } from '../blog/posts.js'
import { AppLink } from '../routing.jsx'

export default function Blog() {
  const posts = getAllPosts()

  return (
    <main id="contenido" className="page">
      <section className="page-hero page-hero--blog">
        <div className="container">
          <div className="page-hero__copy">
            <h1>Blog</h1>
            <p className="lead">
              Guías prácticas para atender inmobiliaria y turismo por WhatsApp:
              responder leads, calificar, agendar y no dejar el chat a medias.
            </p>
          </div>
        </div>
      </section>

      <section className="section blog-list">
        <div className="container blog-list__inner">
          <ul className="blog-cards">
            {posts.map((post) => (
              <li key={post.slug}>
                <AppLink className="blog-card" to={post.path}>
                  {post.coverImage ? (
                    <span className="blog-card__media">
                      <img
                        src={post.coverImage}
                        alt=""
                        width="1200"
                        height="675"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  ) : null}
                  <span className="blog-card__body">
                    <span className="blog-card__meta">
                      <time dateTime={post.date}>
                        {formatPostDate(post.date)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime} de lectura</span>
                    </span>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <span className="blog-card__more">Leer guía</span>
                  </span>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
