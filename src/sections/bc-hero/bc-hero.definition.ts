import type { SectionDefinition } from '@spektra/runtime'
import type { BcHeroData } from './bc-hero.schema'
import { BcHero } from './bc-hero.component'

export const bcHeroDefinition: SectionDefinition<BcHeroData> = {
  type: 'bc-hero',
  component: BcHero,
}
