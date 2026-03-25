import type { SectionDefinition } from '@spektra/runtime'
import type { BcTeamData } from './bc-team.schema'
import { BcTeam } from './bc-team.component'

export const bcTeamDefinition: SectionDefinition<BcTeamData> = {
  type: 'bc-team',
  component: BcTeam,
}
