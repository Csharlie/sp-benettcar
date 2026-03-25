export interface BcContactInfo {
  phone?: string
  email?: string
  address?: string
}

export interface BcContactData {
  title: string
  subtitle?: string
  description?: string
  contactInfo: BcContactInfo
  colorScheme?: 'light' | 'dark'
}
