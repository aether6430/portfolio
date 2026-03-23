import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, Calendar } from 'lucide-react'
import { MDXProvider } from '@mdx-js/react'
import { MermaidDiagram } from '../../components/mdx/MermaidDiagram'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type BlogFrontmatter = { title?: string; date?: string; tags?: string[] }
type BlogModule = { default: React.ComponentType; frontmatter?: BlogFrontmatter }

const mdxModules = import.meta.glob('../../content/blog/*.mdx', { eager: true }) as Record<string, BlogModule>

function findBlogBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug)
  const blogPath = Object.keys(mdxModules).find((path) => {
    const fileName = path.split('/').pop()?.replace('.mdx', '') || ''
    return fileName === decodedSlug
  })

  return blogPath ? mdxModules[blogPath] : null
}

const mdxComponents = {
  // rehype-pretty-code wraps the whole thing in a figure
  figure: ({ children, ...props }: ComponentPropsWithoutRef<'figure'> & { 'data-rehype-pretty-code-figure'?: unknown }) => {
    if ('data-rehype-pretty-code-figure' in props) {
      // Find the deeply nested mermaid code block
      let isMermaid = false;
      let rawCode = '';

      // Traverse children to find mermaid code block and extract its text
      const traverse = (node: ReactNode) => {
        if (typeof node === 'string') {
          rawCode += node
          return
        }

        if (Array.isArray(node)) {
          node.forEach(traverse)
          return
        }

        if (!node || typeof node !== 'object') {
          return
        }

        const nextProps = (node as { props?: { ['data-language']?: string, children?: ReactNode } }).props
        if (nextProps?.['data-language'] === 'mermaid') {
          isMermaid = true;
        }

        // Extract text from the deeply nested spans that shiki generates
        if (nextProps?.children) {
          traverse(nextProps.children);
        }
      };

      traverse(children);

      if (isMermaid) {
        return <MermaidDiagram code={rawCode.trim()} />
      }

      // If it's a regular code block, render the figure (which handles the background/border styling nicely)
      return <figure {...props}>{children}</figure>
    }
    return <figure {...props}>{children}</figure>
  }
}

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
  head: ({ loaderData }) => {
    const data = (loaderData || {}) as BlogFrontmatter
    const title = data?.title || 'Blog Post'
    const tags = data?.tags || []
    const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&tags=${encodeURIComponent(tags.join(','))}`
    return {
      meta: [
        { title: `${title} | Abhiram` },
        { property: 'og:title', content: title },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:image', content: ogImageUrl },
      ],
    }
  },
  loader: ({ params }) => {
    const blog = findBlogBySlug(params.slug)

    if (!blog) {
      throw notFound()
    }

    return blog.frontmatter || {}
  },
})

function BlogPost() {
  const { slug } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const frontmatter = (loaderData || {}) as BlogFrontmatter
  const blog = findBlogBySlug(slug)
  const Post = blog?.default

  if (!Post) {
    throw notFound()
  }

  return (
    <main className="flex flex-col text-sm leading-relaxed pb-12">
      <div className="w-full h-32 md:h-48 dot-bg shrink-0" />

      <section className="flex flex-col">
        <div className="dashed-h" />
        <div className="flex flex-col gap-6 py-6">
          <Link to="/blog" viewTransition={{ types: ['route-back'] }} className="btn-secondary rounded-full self-start">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to blogs</span>
          </Link>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{frontmatter.title || slug}</h1>
            <div className="flex items-center gap-4 text-sm text-app-text-muted">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {frontmatter.date || 'Recent'}</span>
            </div>
          </div>
        </div>
        <div className="dashed-h" />

        <article className="blog-content prose max-w-none rounded-xl prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight pt-6 pb-12">
          <MDXProvider components={mdxComponents}>
            <Post />
          </MDXProvider>
        </article>

        <div className="flex justify-between items-center text-sm text-app-text-muted pt-4 pb-8">
          <span>- Abhiram</span>
          <span>--- fin ---</span>
        </div>
      </section>

      <div className="w-full h-32 md:h-48 dot-bg shrink-0" />
    </main>
  )
}
