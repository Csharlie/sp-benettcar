export interface BcGalleryImage {
  src: string
  alt: string
  category?: string
  caption?: string
}

export interface BcGalleryData {
  title: string
  subtitle?: string
  showCategories?: boolean
  images: BcGalleryImage[]
}
