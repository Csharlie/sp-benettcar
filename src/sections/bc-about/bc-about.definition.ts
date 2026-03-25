import type { SectionDefinition } from '@spektra/runtime'
import type { BcAboutData } from './bc-about.schema'
import { BcAbout } from './bc-about.component'

export const bcAboutDefinition: SectionDefinition<BcAboutData> = {
  type: 'bc-about',
  component: BcAbout,
}
