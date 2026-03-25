import type { SectionDefinition } from '@spektra/runtime'
import type { BcContactData } from './bc-contact.schema'
import { BcContact } from './bc-contact.component'

export const bcContactDefinition: SectionDefinition<BcContactData> = {
  type: 'bc-contact',
  component: BcContact,
}
