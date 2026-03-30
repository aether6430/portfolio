import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: 'Blog | Abhiram' },
      {
        name: 'description',
        content: 'Technical writing from Abhiram on retrieval systems, learning, and product engineering.',
      },
      { property: 'og:title', content: 'Blog | Abhiram' },
      {
        property: 'og:description',
        content: 'Technical writing from Abhiram on retrieval systems, learning, and product engineering.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Blog | Abhiram' },
      {
        name: 'twitter:description',
        content: 'Technical writing from Abhiram on retrieval systems, learning, and product engineering.',
      },
    ],
  }),
  component: BlogList,
})

function BlogList() {
  type BlogFrontmatter = { title?: string; date?: string; tags?: string[]; readTime?: number }
  const mdxModules = import.meta.glob('../../content/blog/*.mdx', { eager: true }) as Record<
    string,
    { frontmatter?: BlogFrontmatter }
  >
  const blogs = Object.entries(mdxModules).map(([path, module]) => {
    const slug = path.split('/').pop()?.replace('.mdx', '') || ''
    const frontmatter = module.frontmatter || {}
    const readTime = frontmatter.readTime || Math.ceil((slug.length / 100) + 3)
    return { slug, ...frontmatter, readTime }
  })

  // Sort blogs by date (newest first), fallback to slug if no date
  const sortedBlogs = blogs.sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    // Parse date in format "Mar 26, 2026"
    const parseDate = (dateStr: string): Date => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const parts = dateStr.split(' ')
      if (parts.length >= 3) {
        const month = monthNames.indexOf(parts[0])
        const day = parseInt(parts[1].replace(',', ''))
        const year = parseInt(parts[2])
        return new Date(year, month, day)
      }
      return new Date(dateStr)
    }
    return parseDate(b.date).getTime() - parseDate(a.date).getTime()
  })
  const blogCardClass = 'group flex flex-col gap-2 p-4 -mx-4 rounded-xl hover:bg-app-surface-hover transition-colors interact-hover'
  const blogTagClass = 'pill px-2 py-0.5 text-[10px]'

  return (
    <main className="flex flex-col text-sm leading-relaxed pb-12">
      <div className="w-full h-32 md:h-48 dot-bg shrink-0" />

      <section className="flex flex-col">
        <div className="dashed-h" />
        <div className="flex items-center gap-4 py-6">
          <Link
            to="/"
            viewTransition={{ types: ['route-back'] }}
            className="p-2 -ml-2 rounded-full hover:bg-app-surface-2 transition-colors interact-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
        </div>
        <div className="dashed-h" />

        <div className="flex flex-col gap-4 pt-6">
          {sortedBlogs.map((blog) => (
            <Link
              key={blog.slug}
              to="/blog/$slug"
              params={{ slug: blog.slug }}
              viewTransition={{ types: ['route-forward'] }}
              className={blogCardClass}
            >
              <h3 className="text-base font-semibold group-hover:underline line-clamp-2">{blog.title || blog.slug}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-app-text-subtle">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date || 'Recent'}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}m</span>
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  {(blog.tags || []).map((tag: string) => (
                    <span key={tag} className={blogTagClass}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="w-full h-32 md:h-48 dot-bg shrink-0 mt-12" />
    </main>
  )
}
