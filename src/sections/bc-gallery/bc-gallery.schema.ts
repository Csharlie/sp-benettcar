import type { Media } from '@spektra/types'

export interface BcGalleryImage extends Media {
  category?: string
  caption?: string
}

export interface BcGalleryData {
  title: string
  subtitle?: string
  showCategories?: boolean
  images: BcGalleryImage[]
}
