import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const manifestPath = path.join(distDir, '.vite', 'manifest.json')

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const vite = await createServer({
    root,
    appType: 'custom',
    logLevel: 'error',
    server: {
      middlewareMode: true,
      hmr: false,
    },
  })

  try {
    const { getPrerenderRoutes, renderRoute } = await vite.ssrLoadModule('/src/ssg.tsx')
    const routes = getPrerenderRoutes()

    for (const route of routes) {
      const html = await renderRoute(route, manifest)
      const relativeOutputPath = route === '/' ? 'index.html' : path.join(route.replace(/^\//, ''), 'index.html')
      const outputPath = path.join(distDir, relativeOutputPath)
      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(outputPath, html)
    }
  } finally {
    await vite.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
