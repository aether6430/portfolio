import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import 'katex/dist/katex.min.css'

const katexFonts = `
/* Override KaTeX default fonts to load from CDN with font-display: swap */
@font-face { font-family: 'KaTeX_Main'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-main-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Main'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-main-bold.woff2') format('woff2'); font-weight: bold; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Main'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-main-italic.woff2') format('woff2'); font-weight: normal; font-style: italic; font-display: swap; }
@font-face { font-family: 'KaTeX_Main'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-main-bolditalic.woff2') format('woff2'); font-weight: bold; font-style: italic; font-display: swap; }
@font-face { font-family: 'KaTeX_Math'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-math-italic.woff2') format('woff2'); font-weight: normal; font-style: italic; font-display: swap; }
@font-face { font-family: 'KaTeX_Math'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-math-bold-italic.woff2') format('woff2'); font-weight: bold; font-style: italic; font-display: swap; }
@font-face { font-family: 'KaTeX_Size1'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-size1-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Size2'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-size2-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Size3'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-size3-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Size4'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-size4-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Caligraphic'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-caligraphic-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Caligraphic'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-caligraphic-bold.woff2') format('woff2'); font-weight: bold; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Fraktur'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-fraktur-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Fraktur'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-fraktur-bold.woff2') format('woff2'); font-weight: bold; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_SansSerif'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-sansserif-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_SansSerif'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-sansserif-bold.woff2') format('woff2'); font-weight: bold; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_SansSerif'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-sansserif-italic.woff2') format('woff2'); font-weight: normal; font-style: italic; font-display: swap; }
@font-face { font-family: 'KaTeX_SansSerif'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-sansserif-bolditalic.woff2') format('woff2'); font-weight: bold; font-style: italic; font-display: swap; }
@font-face { font-family: 'KaTeX_Script'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-script-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Script'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-script-bold.woff2') format('woff2'); font-weight: bold; font-style: normal; font-display: swap; }
@font-face { font-family: 'KaTeX_Typewriter'; src: url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/katex-typewriter-regular.woff2') format('woff2'); font-weight: normal; font-style: normal; font-display: swap; }
`
import { CursorTrail } from '../components/portfolio-motion'
import { ThemeContext } from '../context/theme'
import { smoothEase } from '../components/motion-utils'

type BlogFrontmatter = { title?: string, date?: string, tags?: string[] }
const mdxModules = import.meta.glob('../content/blog/*.mdx', { eager: true }) as Record<string, { frontmatter?: BlogFrontmatter }>
const allBlogs = Object.entries(mdxModules)
  .map(([path, module]) => {
    const slug = path.split('/').pop()?.replace('.mdx', '') || ''
    const frontmatter = module.frontmatter || {}
    return { slug, ...frontmatter }
  })

function NotFoundComponent() {
  const blogCardClass = 'group flex flex-col gap-2 p-4 -mx-4 rounded-xl hover:bg-app-surface-hover transition-colors interact-hover'
  const blogTagClass = 'pill px-2 py-0.5 text-[10px]'

  return (
    <main className="flex flex-col items-center text-center px-6 py-12">
      <motion.pre
        className="text-[0.45rem] sm:text-[0.55rem] md:text-xs font-mono text-app-heading leading-tight overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: smoothEase }}
      >
{`█████╗ ██████╗ ██╗  ██╗██╗██████╗  █████╗ ███╗   ███╗
██╔══██╗██╔══██╗██║  ██║██║██╔══██╗██╔══██╗████╗ ████║
███████║██████╔╝███████║██║██████╔╝███████║██╔████╔██║
██╔══██║██╔══██╗██╔══██║██║██╔══██╗██╔══██║██║╚██╔╝██║
██║  ██║██████╔╝██║  ██║██║██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝`}
      </motion.pre>
      <motion.p
        className="mt-6 text-lg text-app-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        --- 404 - Not Found ---
      </motion.p>
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3, ease: smoothEase }}
      >
        <Link to="/" className="btn-secondary rounded-full">
          Go home
        </Link>
        <Link to="/blog" className="btn-secondary rounded-full">
          View blogs
        </Link>
      </motion.div>

      {allBlogs.length > 0 && (
        <motion.div
          className="w-full mt-12 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: smoothEase }}
        >
          <h2 className="text-lg font-bold mb-4 text-center">Or check out these posts:</h2>
          <div className="flex flex-col gap-4">
            {allBlogs.map((blog) => (
              <Link key={blog.slug} to="/blog/$slug" params={{ slug: blog.slug }} className={blogCardClass}>
                <h3 className="text-base font-semibold group-hover:underline line-clamp-2">{blog.title || blog.slug}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-app-text-subtle">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {blog.date || 'Recent'}
                  </span>
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    {(blog.tags || []).map((tag: string) => (
                      <span key={tag} className={blogTagClass}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  component: () => (
    <ThemeProvider>
      <CursorTrail />
      <style>{katexFonts}</style>
      <div className="min-h-screen selection:bg-app-accent/30 selection:text-brand max-w-2xl mx-auto px-6 dashed-v-container relative isolate">
        <div className="grain-overlay" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  ),
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    const storedTheme = window.localStorage.getItem('theme')
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'
  })

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    document.body.classList.toggle('dark', isDark)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const isDark = theme === 'dark'
    setTheme(isDark ? 'light' : 'dark')
    if (isDark) {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    }
  }

  return (
    // Pass the toggle down or keep it global. Since it's a small app, we can just put the toggle button in the header.
    // For simplicity without context API, we'll just expose it via a custom event or let the page component handle it if needed.
    // Actually, looking at the design, the "Toggle theme" button is right below the name and "Freelancer" tag.
    // Let's just create a global context.
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
