/**
 * Node ESM loader hook — stubs image asset imports to a source-relative path.
 *
 * When tsx runs export-seed.ts, it hits site.ts which imports .jpg/.png files.
 * Vite handles these in dev/build, but Node can't. This loader intercepts
 * image extensions and returns a source-relative path as the default export.
 *
 * The path is relative to the project root (e.g., "src/assets/brands/vw-logo.jpg").
 * This is NOT a working URL — it's a stable, portable reference that must be
 * resolved to an actual WP media URL after media library upload (P11+).
 *
 * Usage: registered via register-asset-hooks.mjs (--import flag)
 *
 * @package Spektra\Client\Benettcar
 */

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i

// Walk up from this file (infra/seed/) to find the project root.
const THIS_URL = new URL(import.meta.url)
const PROJECT_ROOT = new URL('../../', THIS_URL).pathname.replace(/\/$/, '')

/** @type {import('node:module').LoadHook} */
export async function load(url, context, nextLoad) {
  if (IMAGE_EXTENSIONS.test(url)) {
    const fullPath = new URL(url).pathname
    // Strip project root prefix → "src/assets/brands/vw-logo.jpg"
    let relativePath = fullPath
    if (fullPath.startsWith(PROJECT_ROOT)) {
      relativePath = fullPath.slice(PROJECT_ROOT.length + 1) // +1 for leading /
    }
    return {
      format: 'module',
      source: `export default ${JSON.stringify(relativePath)};`,
      shortCircuit: true,
    }
  }
  return nextLoad(url, context)
}
