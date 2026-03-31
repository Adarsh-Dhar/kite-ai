// See: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
