import type { CallToAction, Media } from '@spektra/types'

export interface BcHeroData {
  title: string
  subtitle?: string
  description: string
  primaryCTA?: CallToAction
  secondaryCTA?: CallToAction
  backgroundImage?: Media
}
