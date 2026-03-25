import type { CallToAction, Media } from '@spektra/types'

export interface BcAboutStat {
  value: string
  label: string
}

export interface BcAboutData {
  title: string
  subtitle?: string
  content: string[]
  image?: Media
  imagePosition?: 'left' | 'right'
  stats?: BcAboutStat[]
  cta?: CallToAction
  colorScheme?: 'light' | 'dark'
}
