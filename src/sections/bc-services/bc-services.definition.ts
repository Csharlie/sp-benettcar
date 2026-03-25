import type { SectionDefinition } from '@spektra/runtime'
import type { BcServicesData } from './bc-services.schema'
import { BcServices } from './bc-services.component'

export const bcServicesDefinition: SectionDefinition<BcServicesData> = {
  type: 'bc-services',
  component: BcServices,
}
