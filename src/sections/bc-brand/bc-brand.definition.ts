import type { SectionDefinition } from '@spektra/runtime'
import type { BcBrandData } from './bc-brand.schema'
import { BcBrand } from './bc-brand.component'

export const bcBrandDefinition: SectionDefinition<BcBrandData> = {
  type: 'bc-brand',
  component: BcBrand,
}
