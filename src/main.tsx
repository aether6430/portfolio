import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import { createAppRouter } from './router'
import { inject } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/react'

inject()

const router = createAppRouter()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
const app = (
  <StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
