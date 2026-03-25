import type { Config } from 'tailwindcss'
import { bcPreset } from './src/theme/bc-theme'

export default {
  presets: [bcPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../platform/packages/components/src/**/*.{ts,tsx}',
    '../../platform/packages/templates/src/**/*.{ts,tsx}',
  ],
} satisfies Config
