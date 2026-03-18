import { ImageResponse } from '@vercel/og'
import type { VercelRequest } from '@vercel/node'

export const config = {
  runtime: 'edge',
}

export default function handler(request: VercelRequest) {
  try {
    const url = request.url || 'http://localhost'
    const { searchParams } = new URL(url)
    const title = searchParams.get('title')?.slice(0, 100) || 'Blog Post'
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: '#fafafa',
                lineHeight: 1.1,
                margin: 0,
                maxWidth: 900,
              }}
            >
              {title}
            </h1>
            {tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 32,
                }}
              >
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 20,
                      color: '#a1a1aa',
                      backgroundColor: '#27272a',
                      padding: '8px 16px',
                      borderRadius: 9999,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#71717a',
              fontSize: 24,
            }}
          >
            <span style={{ fontWeight: 600, color: '#a1a1aa' }}>abhiram.app</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
