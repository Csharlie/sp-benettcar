import type { SectionDefinition } from '@spektra/runtime'
import type { BcServiceData } from './bc-service.schema'
import { BcService } from './bc-service.component'

export const bcServiceDefinition: SectionDefinition<BcServiceData> = {
  type: 'bc-service',
  component: BcService,
}
