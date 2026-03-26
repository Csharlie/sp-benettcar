import type { CallToAction } from '@spektra/types'

export interface BcServiceItem {
  label: string
}

export interface BcServiceContact {
  title: string
  description: string
  phone?: string
  messageCta?: CallToAction
  bookingNote?: string
  hours?: string
  weekendHours?: string
}

export interface BcServiceData {
  title: string
  subtitle?: string
  description: string
  services: BcServiceItem[]
  brands: string[]
  contact?: BcServiceContact
}
