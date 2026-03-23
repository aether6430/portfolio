import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

function getViewTransitionTypes({
  fromLocation,
  toLocation,
  pathChanged,
  hashChanged,
}: {
  fromLocation?: { state: { __TSR_index?: number } }
  toLocation: { state: { __TSR_index?: number } }
  pathChanged: boolean
  hashChanged: boolean
}) {
  if (!pathChanged || hashChanged || !fromLocation) {
    return false
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  const fromIndex = fromLocation.state.__TSR_index ?? 0
  const toIndex = toLocation.state.__TSR_index ?? 0

  if (fromIndex === toIndex) {
    return false
  }

  return [fromIndex < toIndex ? 'route-forward' : 'route-back']
}

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultViewTransition: {
    types: getViewTransitionTypes,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
