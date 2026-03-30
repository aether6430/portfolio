import { HeadContent, Matches, RouterContextProvider } from '@tanstack/react-router'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServerRouter } from './router'

type BlogFrontmatter = { title?: string }

type ManifestChunk = {
  file: string
  css?: string[]
  imports?: string[]
  isEntry?: boolean
}

type Manifest = Record<string, ManifestChunk>

const blogModules = import.meta.glob('./content/blog/*.mdx', { eager: true }) as Record<
  string,
  { frontmatter?: BlogFrontmatter }
>

export function getPrerenderRoutes() {
  const blogRoutes = Object.keys(blogModules).map((path) => {
    const slug = path.split('/').pop()?.replace('.mdx', '') || ''
    return `/blog/${slug}`
  })

  return ['/', '/blog', ...blogRoutes]
}

function getEntryChunk(manifest: Manifest) {
  return manifest['index.html'] ?? Object.values(manifest).find((chunk) => chunk.isEntry)
}

function collectCssFiles(manifest: Manifest, chunk: ManifestChunk | undefined, seen = new Set<string>()) {
  if (!chunk) {
    return seen
  }

  for (const cssFile of chunk.css ?? []) {
    seen.add(cssFile)
  }

  for (const importedChunkKey of chunk.imports ?? []) {
    collectCssFiles(manifest, manifest[importedChunkKey], seen)
  }

  return seen
}

function renderDocument(appHtml: string, headHtml: string, assetPaths: { cssFiles: string[]; scriptFile?: string }) {
  const stylesheetLinks = assetPaths.cssFiles
    .map((cssFile) => `<link rel="stylesheet" href="/${cssFile}" />`)
    .join('')

  const scriptTag = assetPaths.scriptFile ? `<script type="module" src="/${assetPaths.scriptFile}"></script>` : ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${stylesheetLinks}
    ${headHtml}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${scriptTag}
  </body>
</html>`
}

export async function renderRoute(url: string, manifest: Manifest) {
  const router = createServerRouter(url)
  await router.load()

  const entryChunk = getEntryChunk(manifest)
  const cssFiles = Array.from(collectCssFiles(manifest, entryChunk))

  const appHtml = renderToStaticMarkup(
    <RouterContextProvider router={router}>
      <Matches />
    </RouterContextProvider>,
  )

  const headHtml = renderToStaticMarkup(
    <RouterContextProvider router={router}>
      <HeadContent />
    </RouterContextProvider>,
  )

  return renderDocument(appHtml, headHtml, {
    cssFiles,
    scriptFile: entryChunk?.file,
  })
}
