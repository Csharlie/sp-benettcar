#!/usr/bin/env node
/**
 * export-seed.ts — Convert Benettcar site.ts to seed.json for ACF import.
 *
 * Pipeline:
 *   site.ts (SiteData) → mapping.ts (extract) → seed.json (ACF-compatible)
 *
 * Usage:
 *   npx tsx export-seed.ts [options]
 *
 * Options:
 *   --output, -o   Output path (default: ../../../../sp-infra/seed/seed.json)
 *   --dry-run      Print seed.json to stdout, don't write file
 *   --verbose      Print field-by-field mapping log
 *
 * @package Spektra\Client\Benettcar
 */

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { siteData } from '../../src/data/site.js'
import { sectionMappings } from './mapping.js'
import type { FieldMapping } from './mapping.js'

// ── CLI args ─────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const verbose = args.includes('--verbose')

function getArgValue(flag: string, short?: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag || (short && args[i] === short)) {
      return args[i + 1]
    }
  }
  return undefined
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultOutput = resolve(__dirname, '../../../../sp-infra/seed/seed.json')
const outputPath = getArgValue('--output', '-o') ?? defaultOutput

// ── Build seed ───────────────────────────────────────────────────

interface SeedJson {
  post_id: string
  site_options: Record<string, string>
  fields: Record<string, unknown>
}

function buildSeed(): SeedJson {
  const seed: SeedJson = {
    post_id: 'front_page',
    site_options: {
      blogname: siteData.site.name,
      blogdescription: siteData.site.description ?? '',
    },
    fields: {},
  }

  // Get sections from first page (home)
  const page = siteData.pages[0]
  if (!page) {
    console.error('No pages found in siteData')
    process.exit(1)
  }

  for (const section of page.sections) {
    const mapping = sectionMappings.find((m) => m.sectionType === section.type)
    if (!mapping) {
      if (verbose) {
        console.log(`[SKIP] No mapping for section type: ${section.type}`)
      }
      continue
    }

    if (verbose) {
      console.log(`\n[SECTION] ${section.type} (id: ${section.id})`)
    }

    const data = section.data as Record<string, unknown>

    for (const field of mapping.fields) {
      const value = field.extract(data)
      if (value === null || value === undefined) {
        if (verbose) {
          console.log(`  [SKIP] ${field.acfKey}: null/undefined`)
        }
        continue
      }

      seed.fields[field.acfKey] = value

      if (verbose) {
        logField(field, value)
      }
    }
  }

  return seed
}

function logField(field: FieldMapping, value: unknown): void {
  if (field.kind === 'repeater' && Array.isArray(value)) {
    console.log(`  [${field.kind}] ${field.acfKey}: ${value.length} rows`)
  } else if (field.kind === 'group' && typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>)
    console.log(`  [${field.kind}] ${field.acfKey}: {${keys.join(', ')}}`)
  } else if (field.kind === 'image' && typeof value === 'object') {
    const img = value as { url: string; alt: string }
    console.log(
      `  [${field.kind}] ${field.acfKey}: ${img.url.substring(0, 60)}...`,
    )
  } else {
    const display =
      typeof value === 'string' && value.length > 60
        ? value.substring(0, 60) + '...'
        : value
    console.log(`  [${field.kind}] ${field.acfKey}: ${display}`)
  }
}

// ── Local asset detection ────────────────────────────────────────

/**
 * Scan seed fields for local asset paths (non-URL image references).
 * These come from ES-imported images resolved by asset-loader.mjs
 * and are NOT valid web URLs — they need media library upload (P11+).
 */
function detectLocalAssets(fields: Record<string, unknown>): string[] {
  const warnings: string[] = []

  function scan(value: unknown, path: string): void {
    if (typeof value === 'string' && value.length > 0) {
      // Local asset: relative path like "src/assets/brands/vw-logo.jpg"
      // (not starting with http/https, but has an image extension)
      if (
        !value.startsWith('http://') &&
        !value.startsWith('https://') &&
        !value.startsWith('#') &&
        /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(value)
      ) {
        warnings.push(`${path}: "${value}"`)
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => scan(item, `${path}[${i}]`))
    } else if (typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        scan(v, `${path}.${k}`)
      }
    }
  }

  for (const [key, val] of Object.entries(fields)) {
    scan(val, key)
  }

  return warnings
}

// ── Main ─────────────────────────────────────────────────────────

const seed = buildSeed()
const json = JSON.stringify(seed, null, 2)

const fieldCount = Object.keys(seed.fields).length
console.log(`\nSeed generated: ${fieldCount} fields`)

// Warn about local asset references
const localAssets = detectLocalAssets(seed.fields)
if (localAssets.length > 0) {
  console.log(`\n⚠ LOCAL ASSET REFERENCES (${localAssets.length}):`)
  console.log('  These are NOT valid web URLs — media library upload needed (P11+).')
  for (const w of localAssets) {
    console.log(`  · ${w}`)
  }
}

if (dryRun) {
  console.log('\n--- DRY RUN ---\n')
  console.log(json)
} else {
  writeFileSync(outputPath, json, 'utf-8')
  console.log(`Written to: ${outputPath}`)
}
