import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFile } from 'fs/promises'
import { join } from 'path'

const blogData: Record<string, { title: string; description: string; tags: string[] }> = {
  'ai-visualization-layer': {
    title: 'Building an AI Visualization Layer from Scratch (and What I Stole from Claude)',
    description: 'How I built a real-time visualization layer that streams alongside AI text responses, adapted from Claude\'s approach.',
    tags: ['Avenire', 'AI', 'Visualization', 'Engineering', 'Design'],
  },
  'search-retrieval-system': {
    title: 'How I Built Avenire\'s Search Retrieval System',
    description: 'Multimodal embeddings, PDF pipelines, and video ingestion - making search actually work for educational content.',
    tags: ['Avenire', 'RAG', 'AI', 'Engineering', 'Search'],
  },
  'learning-itself': {
    title: 'What Building Avenire Taught Me About Learning Itself',
    description: 'The strange recursion of building a learning platform - how the scaffolding you build for others ends up building you back.',
    tags: ['Avenire', 'Learning', 'AI', 'Education'],
  },
  'naming-avenire': {
    title: 'Why I Named My Startup Avenire — A Word That Doesn\'t Exist in English',
    description: 'On naming, meaning, and the philosophical weight of choosing what to call something you\'re building.',
    tags: ['Avenire', 'Startups', 'Naming', 'Philosophy'],
  },
  'study-tool-jee': {
    title: 'Why I\'m Building a Study Tool While Preparing for the Hardest Exam of My Life',
    description: 'JEE preparation and startup building - not a conflict, but a recursion that makes each one better.',
    tags: ['Avenire', 'Learning', 'JEE', 'Startups'],
  },
}

const defaultOG = {
  title: 'Abhiram | Student | Founder',
  description: 'Personal website of Abhiram - student, founder, and builder of Avenire.',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const htmlPath = join(process.cwd(), 'dist', 'index.html')
    let htmlContent = await readFile(htmlPath, 'utf-8')

    const path = req.url || '/'
    const slugMatch = path.match(/\/blog\/([^/?]+)/)
    const slug = slugMatch ? decodeURIComponent(slugMatch[1]) : null

    let ogData = defaultOG
    let ogImage = '/api/og?title=Abhiram%20%7C%20Student%20%7C%20Founder'

    if (slug && blogData[slug]) {
      const blog = blogData[slug]
      ogData = {
        title: `${blog.title} | Abhiram`,
        description: blog.description,
      }
      ogImage = `/api/og?title=${encodeURIComponent(blog.title)}&tags=${encodeURIComponent(blog.tags.join(','))}`
    }

    htmlContent = htmlContent.replace(/__OG_TITLE__/g, ogData.title)
    htmlContent = htmlContent.replace(/__OG_DESCRIPTION__/g, ogData.description)
    htmlContent = htmlContent.replace(/__OG_IMAGE__/g, ogImage)
    htmlContent = htmlContent.replace(/<title>.*?<\/title>/, `<title>${ogData.title}</title>`)

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(htmlContent)
  } catch (e: any) {
    console.error(e)
    res.status(500).send('Error rendering page')
  }
}
