/**
 * Node ESM loader hook — stubs image asset imports to their file path.
 *
 * When tsx runs export-seed.ts, it hits site.ts which imports .jpg/.png files.
 * Vite handles these in dev/build, but Node can't. This loader intercepts
 * image extensions and returns the file path as the default export.
 *
 * Usage: registered via register-asset-hooks.mjs (--import flag)
 *
 * @package Spektra\Client\Benettcar
 */

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i

/** @type {import('node:module').LoadHook} */
export async function load(url, context, nextLoad) {
  if (IMAGE_EXTENSIONS.test(url)) {
    // Return the file path as the default exported string (mimics Vite behavior)
    const path = new URL(url).pathname
    return {
      format: 'module',
      source: `export default ${JSON.stringify(path)};`,
      shortCircuit: true,
    }
  }
  return nextLoad(url, context)
}
