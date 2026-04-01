var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        manifest: true,
    },
    plugins: [
        tailwindcss(),
        TanStackRouterVite(),
        __assign(__assign({}, mdx({
            remarkPlugins: [
                remarkFrontmatter,
                remarkMdxFrontmatter,
                remarkGfm,
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
        })), { enforce: 'pre' }),
        react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
