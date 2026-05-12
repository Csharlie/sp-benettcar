import type { CallToAction } from '@spektra/types'

export interface BcServiceItem {
  label: string
  detail?: string
}

export interface BcServiceContact {
  title: string
  description: string
  phone?: string
  messageCta?: CallToAction
  contactCta?: CallToAction
  bookingNote?: string
  hours?: string
  weekendHours?: string
  hoursNote?: string
}

export interface BcServiceData {
  title: string
  subtitle?: string
  description?: string
  services: BcServiceItem[]
  brands: string[]
  serviceListTitle?: string
  brandsTitle?: string
  contact?: BcServiceContact
}
