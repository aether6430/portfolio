import { createBrowserHistory, createMemoryHistory, type RouterHistory } from '@tanstack/history'
import { createRouter } from '@tanstack/react-router'
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

export function createAppRouter(options?: { history?: RouterHistory }) {
  const history = options?.history ?? createBrowserHistory()

  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultViewTransition: {
      types: getViewTransitionTypes,
    },
  })
}

export function createServerRouter(url: string) {
  return createAppRouter({
    history: createMemoryHistory({
      initialEntries: [url],
    }),
  })
}

