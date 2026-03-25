import type { SectionDefinition } from '@spektra/runtime'
import type { BcAssistanceData } from './bc-assistance.schema'
import { BcAssistance } from './bc-assistance.component'

export const bcAssistanceDefinition: SectionDefinition<BcAssistanceData> = {
  type: 'bc-assistance',
  component: BcAssistance,
}
