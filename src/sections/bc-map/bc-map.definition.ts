import type { SectionDefinition } from '@spektra/runtime'
import type { BcMapData } from './bc-map.schema'
import { BcMap } from './bc-map.component'

export const bcMapDefinition: SectionDefinition<BcMapData> = {
  type: 'bc-map',
  component: BcMap,
}
