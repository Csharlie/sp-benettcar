/**
 * Register asset loader hooks for Node ESM.
 *
 * This file is loaded via --import flag and uses module.register()
 * to install the asset-loader hooks in the correct loader thread.
 *
 * Usage:
 *   tsx --import ./infra/seed/register-asset-hooks.mjs ...
 *
 * @package Spektra\Client\Benettcar
 */

import { register } from 'node:module'

register('./asset-loader.mjs', import.meta.url)
