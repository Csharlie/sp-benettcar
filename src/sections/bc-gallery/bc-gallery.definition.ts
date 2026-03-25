import type { SectionDefinition } from '@spektra/runtime'
import type { BcGalleryData } from './bc-gallery.schema'
import { BcGallery } from './bc-gallery.component'

export const bcGalleryDefinition: SectionDefinition<BcGalleryData> = {
  type: 'bc-gallery',
  component: BcGallery,
}
