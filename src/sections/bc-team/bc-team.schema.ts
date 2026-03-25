import type { Media } from '@spektra/types'

export interface BcTeamMember {
  name: string
  role: string
  image?: Media
  phone?: string
  email?: string
}

export interface BcTeamData {
  title: string
  subtitle?: string
  description?: string
  members: BcTeamMember[]
}
