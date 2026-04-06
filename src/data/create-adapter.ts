import { createJsonAdapter, createWordPressAdapter } from '@spektra/data'
import type { SiteDataAdapter } from '@spektra/types'
import { siteData } from './site'
import { mapWordPressSiteData } from './wp-mapper'
import { normalizeSiteData } from './normalize-site-data'

export function createAdapter(): SiteDataAdapter {
  const source = import.meta.env.VITE_DATA_SOURCE ?? 'json'

  switch (source) {
    case 'wordpress': {
      const apiBase = import.meta.env.VITE_WP_API_BASE as string | undefined
      if (!apiBase) {
        throw new Error(
          'VITE_WP_API_BASE is required when VITE_DATA_SOURCE=wordpress',
        )
      }
      return createWordPressAdapter({
        apiBase,
        mapResponse: (raw) => normalizeSiteData(mapWordPressSiteData(raw)),
      })
    }
    case 'json':
      return createJsonAdapter({ data: siteData })
    default:
      console.warn(
        `Unknown VITE_DATA_SOURCE "${source}", falling back to json`,
      )
      return createJsonAdapter({ data: siteData })
  }
}
