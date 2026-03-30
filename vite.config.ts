import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
  },
  plugins: [
    tailwindcss(),
    TanStackRouterVite(),
    {
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkMath
        ],
        rehypePlugins: [
          rehypeKatex,
          [rehypePrettyCode, {
            theme: {
              light: 'github-light',
              dark: 'github-dark-dimmed',
            },
            keepBackground: false,
          }]
        ],
        providerImportSource: "@mdx-js/react"
      }),
      enforce: 'pre'
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
