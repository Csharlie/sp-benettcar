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
			[
				'label' => 'Galéria',
				'href'  => '#gallery',
			],
			[
				'label' => 'Szolgáltatások',
				'href'  => '#services',
			],
			[
				'label' => 'Szerviz',
				'href'  => '#car-service',
			],
			[
				'label' => 'Rólunk',
				'href'  => '#about',
			],
			[
				'label' => 'Útmenti segítség',
				'href'  => '#roadside',
			],
		],
		'footer' => [
			[
				'label' => 'Autószerviz',
				'href'  => '#car-service',
			],
			[
				'label' => 'Útmenti segítség',
				'href'  => '#roadside',
			],
			[
				'label' => 'Rólunk',
				'href'  => '#about',
			],
			[
				'label' => 'Kapcsolat',
				'href'  => '#contact',
			],
			[
				'label' => 'Adatvédelem',
				'href'  => '#privacy',
			],
			[
				'label' => 'ÁSZF',
				'href'  => '#terms',
			],
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
