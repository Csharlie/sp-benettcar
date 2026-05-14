<?php
/**
 * Benettcar client overlay config for Spektra API plugin.
 *
 * Loaded by spektra-api.php via Strategy B (ENV var / symlink fallback).
 * This file MUST return an associative array.
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [

	// ── Client identity ──────────────────────────────────────────
	'client_slug' => 'benettcar',
	'client_name' => 'Benett Car',

	// ── CORS ─────────────────────────────────────────────────────
	// Origins allowed to call the REST endpoint.
	// Vite dev server uses port 5174 (explicit in vite.config.ts).
	'allowed_origins' => [
		'http://localhost:5174',
		'https://benettcar.hu',
		'https://www.benettcar.hu',
	],

	// CF7 (Contact Form 7) and similar 3rd-party REST namespaces also need
	// the same CORS treatment as our /spektra/ routes — the frontend POSTs
	// directly to them. Without this, browser preflight blocks the request
	// with "No 'Access-Control-Allow-Origin'".
	// Used by spektra-config-bootstrap.php (Benettcar overlay plugin).
	'cors_extra_namespaces' => [
		'/contact-form-7/',
	],

	// ── Site defaults ────────────────────────────────────────────
	// Fallback values when ACF fields are empty or missing.
	'site_defaults' => [
		'lang'  => 'hu',
		'title' => 'Benett Car',
	],

	// ── Navigation menus ───────────────────────────────────────
	// Primary source for navigation in WordPress.
	// If these menus do not exist yet, the curated navigation fallback below is used.
	'navigation_menus' => [
		'primary' => 'spektra-primary',
		'footer'  => 'spektra-footer',
	],

	// ── Navigation ───────────────────────────────────────────────
	// Curated fallback navigation items for the site.
	// Used only until the WordPress menus above are created.
	'navigation' => [
		'primary' => [
			[ 'label' => 'Galéria',         'href' => '#gallery' ],
			[ 'label' => 'Szolgáltatások',  'href' => '#services' ],
			[ 'label' => 'Rólunk',          'href' => '#about' ],
			[ 'label' => 'Útmenti segítség', 'href' => '#roadside' ],
		],
		'footer' => [
			[ 'label' => 'Rólunk',     'href' => '#about' ],
			[ 'label' => 'Galéria',    'href' => '#gallery' ],
			[ 'label' => 'Kapcsolat',  'href' => '#contact' ],
			[ 'label' => 'Adatvédelem', 'href' => '#privacy' ],
			[ 'label' => 'ÁSZF',       'href' => '#terms' ],
		],
	],

	// ── Sections ─────────────────────────────────────────────────
	// ACF field group slugs that map to SiteData sections.
	// Order matches site.ts pages[home].sections[] rendering order.
	'sections' => [
		'bc-hero',
		'bc-brand',
		'bc-gallery',
		'bc-services',
		'bc-service',
		'bc-about',
		'bc-team',
		'bc-assistance',
		'bc-contact',
		'bc-map',
	],

];
