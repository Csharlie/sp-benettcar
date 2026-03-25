export interface BcServiceCard {
  title: string
  icon: string
  description: string
}

export interface BcServicesData {
  title: string
  subtitle?: string
  services: BcServiceCard[]
}
