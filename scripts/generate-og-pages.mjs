import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

const siteOrigin = process.env.SITE_URL || 'https://damod.space'
const distDir = path.resolve('dist')

const blogData = {
  'ai-visualization-layer': {
    title: 'Building an AI Visualization Layer from Scratch (and What I Stole from Claude)',
    description:
      "How I built a real-time visualization layer that streams alongside AI text responses, adapted from Claude's approach.",
    tags: ['Avenire', 'AI', 'Visualization', 'Engineering', 'Design'],
  },
  'search-retrieval-system': {
    title: "How I Built Avenire's Search Retrieval System",
    description:
      'Multimodal embeddings, PDF pipelines, and video ingestion - making search actually work for educational content.',
    tags: ['Avenire', 'RAG', 'AI', 'Engineering', 'Search'],
  },
  'learning-itself': {
    title: 'What Building Avenire Taught Me About Learning Itself',
    description:
      'The strange recursion of building a learning platform - how the scaffolding you build for others ends up building you back.',
    tags: ['Avenire', 'Learning', 'AI', 'Education'],
  },
  'naming-avenire': {
    title: "Why I Named My Startup Avenire - A Word That Doesn't Exist in English",
    description:
      "On naming, meaning, and the philosophical weight of choosing what to call something you're building.",
    tags: ['Avenire', 'Startups', 'Naming', 'Philosophy'],
  },
  'study-tool-jee': {
    title: "Why I'm Building a Study Tool While Preparing for the Hardest Exam of My Life",
    description:
      'JEE preparation and startup building - not a conflict, but a recursion that makes each one better.',
    tags: ['Avenire', 'Learning', 'JEE', 'Startups'],
  },
}

const defaultOG = {
  title: 'Abhiram | Student | Founder',
  description: 'Personal website of Abhiram - student, founder, and builder of Avenire.',
}

const blogIndexOG = {
  title: 'Blogs | Abhiram',
  description: 'Writing on building Avenire, learning, startups, and engineering.',
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function ogImageUrl(title, tags = []) {
  const params = new URLSearchParams({ title })
  if (tags.length > 0) {
    params.set('tags', tags.join(','))
  }
  return `${siteOrigin}/api/og?${params.toString()}`
}

function renderHtml(template, meta) {
  return template
    .replace(/__OG_TITLE__/g, escapeHtml(meta.title))
    .replace(/__OG_DESCRIPTION__/g, escapeHtml(meta.description))
    .replace(/__OG_IMAGE__/g, escapeHtml(meta.ogImage))
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
}

async function writePage(outputPath, template, meta) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderHtml(template, meta))
}

const template = await readFile(path.join(distDir, 'index.html'), 'utf-8')

await writePage(path.join(distDir, 'index.html'), template, {
  ...defaultOG,
  ogImage: ogImageUrl(defaultOG.title),
})

await writePage(path.join(distDir, 'blog', 'index.html'), template, {
  ...blogIndexOG,
  ogImage: ogImageUrl(blogIndexOG.title),
})

for (const [slug, blog] of Object.entries(blogData)) {
  const meta = {
    title: `${blog.title} | Abhiram`,
    description: blog.description,
    ogImage: ogImageUrl(blog.title, blog.tags),
  }

  await writePage(path.join(distDir, 'blog', `${slug}.html`), template, meta)
  await writePage(path.join(distDir, 'blog', slug, 'index.html'), template, meta)
}
