import { useEffect } from 'react'
import './App.css'
import { Seo } from './Seo.jsx'
import { RouteProvider, useRoute } from './routing.jsx'
import { SiteFooter, SiteNav } from './SiteChrome.jsx'
import About from './pages/About.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import NicheLanding from './pages/NicheLanding.jsx'
import NotFound from './pages/NotFound.jsx'

function Routes() {
  const { path } = useRoute()

  if (path === '/nosotros') return <About />
  if (path === '/contacto') return <Contact />
  if (path === '/blog') return <Blog />
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length).replace(/\/$/, '')
    if (slug && !slug.includes('/')) return <BlogPost slug={slug} />
  }
  if (path === '/inmobiliarias') return <NicheLanding variantId="inmobiliarias" />
  if (path === '/turismo') return <NicheLanding variantId="turismo" />
  if (path === '/' || path === '') return <Home />
  return <NotFound />
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])

  return (
    <RouteProvider>
      <Seo />
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <SiteNav />
      <Routes />
      <SiteFooter />
    </RouteProvider>
  )
}
