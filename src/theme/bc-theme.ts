import type { Config } from 'tailwindcss'
import { basePreset } from '@spektra/themes'

/**
 * Benettcar Tailwind preset — dark graphite + neon-blue accent theme.
 *
 * Extends basePreset with client-specific color palettes:
 * - graphite: dark charcoal scale (background)
 * - neon-blue: cyan accent (CTAs, highlights)
 * - red-accent: secondary brand color
 *
 * Usage:
 *   import { bcPreset } from './theme/bc-theme'
 *   export default { presets: [bcPreset] } satisfies Config
 */
export const bcPreset = {
  presets: [basePreset],
  theme: {
    extend: {
      colors: {
        graphite: {
          50: '#f5f5f6',
          100: '#e6e6e7',
          200: '#cfcfd2',
          300: '#adaeb3',
          400: '#84858c',
          500: '#696a72',
          600: '#59596f',
          700: '#4a4a5e',
          800: '#40404f',
          900: '#1a1a24',
          950: '#0f0f14',
        },
        'neon-blue': {
          DEFAULT: '#00D4E0',
          light: '#00E5FF',
          dark: '#00A8B8',
        },
        'red-accent': {
          DEFAULT: '#8B1C1C',
          light: '#A52A2A',
          dark: '#6B0F0F',
        },
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>
